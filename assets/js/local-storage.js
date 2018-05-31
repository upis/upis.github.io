(function() {
  var generateBt = document.getElementById('generate');
  var saveToken = document.getElementById('save-token');
  var token = document.getElementById('private-token');
  var platform = document.getElementById("platform")

  generateBt.addEventListener('click', function (event) {
    if (saveToken.checked) {
      localStorage.setItem(platform.value + "-token", token.value);
    } else {
      localStorage.clear()
    }
  })

  function getToken() {
    token.value = localStorage.getItem(platform.value + "-token");
    if (!!token.value) saveToken.checked = true;
  }

  platform.addEventListener("change", function (event) {
    getToken();
  })

  getToken();
})();
