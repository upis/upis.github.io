function tryReadFile(project, platform) {
  var fileExtension = /json.*/;
  var fileTobeRead = gt("#json_file").files[0];
  if (fileTobeRead && fileTobeRead.type.match(fileExtension)) {
    var fileReader = new FileReader();
    fileReader.onload = function (e) {
      var arr = JSON.parse(fileReader.result);
      if (Array.isArray(arr)) {
        sendIssues(0);
        function sendIssues(i) {
          if (i < arr.length) {
            if (arr[i].title && arr[i].title != "" && encodeURIComponent(arr[i].title) != "%0A") {
              var description = (arr[i].description)? arr[i].description: "";
              var labels = (arr[i].labels)? arr[i].labels: [];
              var weight = (arr[i].weight)? arr[i].weight: undefined;
              var obj = callPlatform(platform, project, arr[i].title, description, labels.join(), weight);
              _post(
                obj.url + project + "/issues",
                obj.content,
                function(data) { sendIssues(i + 1) },
                function(data) { console.error(data) },
                obj.token
              );
            } else {
              sendIssues(i + 1)
            }
          } else {
            alert("Finalizado!");
          }
        }
      }
    }
    fileReader.readAsText(fileTobeRead);
  }
}

function tryReadTextArea(project, platform) {
  var issues = gt("#content").value.split("- ");
  mountAndSend(issues, 0);
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
          var obj = callPlatform(platform, project, issue, description, labels, weight);
          _post(
            obj.url + project + "/issues",
            obj.content,
            function(data) { mountAndSend(issues, i + 1) },
            function(data) { console.error(data) },
            obj.token
          );
        } else {
          mountAndSend(issues, i + 1)
        }
      } else {
        mountAndSend(issues, i + 1)
      }
    } else {
      alert("Finalizado!")
    }
  }
}
