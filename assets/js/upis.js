gt("#platform").addEventListener("change", function(e) {
  if (e.target.value == "bitbucket") {
    gt("#secret-group").classList.remove("hidden");
  } else {
    gt("#secret-group").classList.add("hidden");
  }
})

if (gt("#platform").value == "bitbucket") {
  gt("#secret-group").classList.remove("hidden");
}

gt("#generate").addEventListener("click", function() {
  var project = gt("#project-url").value;
  var token = gt("#private-token").value;
  var issues = gt("#content").value.split("- ");
  var url = ""
  mountAndSend(issues, 0);

  function toGitLab(project, issue, description, labels) {
    url = "https://gitlab.com/api/v4/projects/"
    project = project.replace("/", "%2F")
    return {
      "id": project,
      "title": issue,
      "description": description,
      "labels": labels
    };
  }

  function toBitBucket(issue, description, labels) {
    url = "https://api.bitbucket.org/1.0/repositories/"
    labels = (labels)? labels.split(",") : [];
    return {
      "title": issue,
      "description": description,
      "status": labels,
      "oauth_token": token,
      "oauth_token_secret": gt("#secret").value
    }
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

  function callPlatform(project, issue, description, labels) {
    var platform = gt("#platform").value;
    var result = {};
    switch(platform) {
      case "gitlab":
        result = toGitLab(project, issue, description, labels);
        break;
      case "github":
        result = toGitHub(issue, description, labels)
        break;
      case "bitbucket":
        result = toBitBucket(issue, description, labels);
        break;
    }
    return result;
  }

  function mountAndSend(issues, i) {
    if (i < issues.length) {
      var issue = issues[i];
      if (issue && issue != "" && issue != "%0A") {
        var content = issue.split("> ")
        var issue = content[0]
        var description = null;
        var labels = null;

        if (content[1]) {
          var finish = content[1].split("# ");
          var description = finish[0];
          if (finish[1]) labels = finish[1].trim();
        } else {
          content = issue.split("# ");
          issue = content[0];
          if (content[1]) labels = content[1].trim();
        }
        if (!description) description = "";
        if (!labels) labels = "";


        if (encodeURIComponent(issue)!="%0A") {
          var dt = callPlatform(project, issue, description, labels);
          var header = false;
          if (gt("#platform").value == "gitlab") {
            project = project.replace("/", "%2F")
            header = true;
          }
        
          console.log(dt);
          _post(
            url + project + "/issues",
            dt,
            function(data) { mountAndSend(issues, i + 1) },
            function(data) { console.error(data) },
            token,
            header
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
