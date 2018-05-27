gt("#generate").addEventListener("click", function() {
  var project = gt("#project-url").value;
  var token = gt("#private-token").value;
  var issues = gt("#content").value.split("- ");
  var url = ""
  mountAndSend(issues, 0);

  function toGitLab(project, issue, coment, labels) {
    url = "https://gitlab.com/api/v4/projects/"
    project = project.replace("/", "%2F")
    return {
      "id": project,
      "title": issue,
      "description": coment,
      "labels": labels
    };
  }

  function toGitHub(issue, coment, labels) {
    url = "https://api.github.com/repos/";
    token = null;
    labels = (labels)? labels.split(",") : [];
    return {
      "title": issue,
      "body": coment,
      "labels": labels,
      "access_token": gt("#private-token").value
    }
  }

  function mountAndSend(issues, i) {
    if (i < issues.length) {
      var issue = issues[i];
      if (issue && issue != "" && issue != "%0A") {
        var content = issue.split("> ")
        var issue = content[0]
        var coment = null;
        var labels = null;
        if (content[1]) {
          var subcontent = content[1];
          var finish = subcontent.split("# ");
          var coment = finish[0];
          if (finish[1]) labels = finish[1].trim();
        } else {
          content = issue.split("# ");
          issue = content[0];
          if (content[1]) labels = content[1].trim();
        }
        if (!coment) coment = "";
        if (!labels) labels = "";


        if (encodeURIComponent(issue)!="%0A") {
          var dt = (gt("#platform").value == "gitlab")? toGitLab(project, issue, coment, labels) : toGitHub(issue, coment, labels)
          console.log(dt)
          if (gt("#platform").value == "gitlab") project = project.replace("/", "%2F")
          _post(
            url + project + "/issues",
            dt,
            function(data) {
              mountAndSend(issues, i + 1)
            },
            function(data) { console.error(data) },
            token
          )
        } else {
          mountAndSend(issues, i + 1)
        }
      } else {
        mountAndSend(issues, i + 1)
      }

    }
  }

})
