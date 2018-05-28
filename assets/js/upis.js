gt("#generate").addEventListener("click", function() {
  var project = gt("#project-url").value;
  var token = gt("#private-token").value;
  var issues = gt("#content").value.split("- ");
  var url = ""
  mountAndSend(issues, 0);

  function toGitLab(project, issue, description, labels, weight) {
    url = "https://gitlab.com/api/v4/projects/"
    project = project.replace("/", "%2F")
    weight = (weight)? parseInt(weight): null;
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
    labels = (labels)? labels.split(",") : [];
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

  function mountAndSend(issues, i) {
    if (i < issues.length) {
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
            function(data) { mountAndSend(issues, i + 1) },
            function(data) { console.error(data) },
            token
          );
        } else {
          mountAndSend(issues, i + 1)
        }
      } else {
        mountAndSend(issues, i + 1)
      }

    }
  }

})
