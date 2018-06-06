gt("#generate").addEventListener("click", function() {
  var project = gt("#project-url").value;
  var token = gt("#private-token").value;
  var issues = gt("#content").value.split("");

  if (issues[0] == "{") {
    var val = JSON.parse(gt("#content").value); 
    var issues = val.issues;
    var type = "JSON"
  }else{
    var issues = gt("#content").value.split("- ");   
    var type = "STRING"
  }
  var url = ""
  mountAndSend(issues, 0, type);

  function toGitLab(project, issue, description, labels, weight) {
    url = "https://gitlab.com/api/v4/projects/"
    weight = (weight)? parseInt(weight): null;
    description = description.replace(/\n/g, "  \n");
    var obj =  {
      "id": project,
      "title": issue,
      "description": description,
      "labels": labels,
      "weight": weight
    };

    if (!weight) delete obj.weight
    return obj;
  }

  function toGitHub(issue, description, labels) {
    url = "https://api.github.com/repos/";
    token = null;
    if(labels){
      if (!Array.isArray(labels)) labels = labels.split(",");
    }else{
      labels = [];
    }
    
    return {
      "title": issue,
      "body": description,
      "labels": labels,
      "access_token": gt("#private-token").value
    }
  }

  function callPlatform(platform, project, issue, description, labels, weight) {
    var result = {};

    switch (platform) {
      case "gitlab":
        result = toGitLab(project, issue, description, labels, weight);
        break;
      case "github":
        result = toGitHub(issue, description, labels)
        break;
    }
    return result;
  }

  function mountAndSend(issues, i, type) {
    
    if (i < issues.length) {
      if (type == "JSON") {
        
        var issue = issues[i];
        var description = "";
        var labels = "";
        var weight = "";

        if (issue.description) description = issue.description;
        if (issue.labels) labels = issue.labels;
        if (issue.weight) weight = issue.weight;
        issue = issue.title;

        var platform = gt("#platform").value;
        if (platform == "gitlab") project = project.replace(/\//g, "%2F");
        var obj = callPlatform(platform, project, issue, description, labels, weight);
        _post(
          url + project + "/issues",
          obj,
          function(data) { mountAndSend(issues, i + 1, "JSON") },
          function(data) { console.error(data) },
          token
        );
              
      }else{
        
        var issue = issues[i];
        var description = "";
        var labels = "";
        var weight = "";
        var tmp = null;

        if (issue && issue != "" && encodeURIComponent(issue) != "%0A") {

          tmp = issue.split("$w ");
          if (tmp[1]) weight = tmp[1].trim();

          tmp = tmp[0].split("# ");
          if (tmp[1]) labels = tmp[1].trim();

          tmp = tmp[0].split("> ");
          if (tmp[1]) description = tmp[1].trim();

          issue = tmp[0].trim();

          if (encodeURIComponent(issue) != "%0A") {
            var platform = gt("#platform").value;
            if (platform == "gitlab") project = project.replace(/\//g, "%2F")
            var obj = callPlatform(platform, project, issue, description, labels, weight);
            _post(
              url + project + "/issues",
              obj,
              function(data) { mountAndSend(issues, i + 1, "STRING") },
              function(data) { console.error(data) },
              token
            );
          } else {
            mountAndSend(issues, i + 1, "STRING")
          }
        } else {
          mountAndSend(issues, i + 1, "STRING")
        }
      }
    }
  }

});

gt("#json_file").addEventListener("change", function(){
  var fileExtension = /json.*/;
  var fileTobeRead = this.files[0];

  if (fileTobeRead.type.match(fileExtension)) {
      var fileReader = new FileReader();
      fileReader.onload = function (e) {
          var fileContents = document.getElementById('content');
          var ugly = fileReader.result;
          var obj = JSON.parse(ugly);
          var pretty = JSON.stringify(obj, undefined, 4);
          fileContents.value = pretty;
      }
      fileReader.readAsText(fileTobeRead);
  }else{
    this.value = "";
    alert("Invalid extension");
  }
});