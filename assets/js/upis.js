function toGitLab(project, issue, description, labels, weight) {
  weight = (weight)? parseInt(weight): null;
  description = description.replace(/\n/g, "  \n");
  var obj =  {
    "url": "https://gitlab.com/api/v4/projects/",
    "token": gt("#private-token").value,
    "content":  {
      "id": project,
      "title": issue,
      "description": description,
      "labels": labels,
      "weight": weight
    }
  };

  if (!weight) delete obj.content.weight
  return obj;
}

function toGitHub(issue, description, labels) {
  labels = (labels)? labels.split(",") : [];
  return {
    "url":"https://api.github.com/repos/",
    "token": null,
    "content": {
      "title": issue,
      "body": description,
      "labels": labels,
      "access_token": gt("#private-token").value
    }
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
