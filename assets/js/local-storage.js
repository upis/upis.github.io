var generateBt = document.getElementById('generate');
var saveToken = document.getElementById('save-token');
var token = document.getElementById('private-token');

generateBt.addEventListener('click', function (event) {
  if (saveToken.checked) {
    localStorage.setItem("token", token.value);
  }
})

token.value = localStorage.getItem("token");
