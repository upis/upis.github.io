/**
 * Stores user info from localStorage
 *
 * @type {void}
 */
_user = (localStorage.logged)? JSON.parse(localStorage.logged).data : {};

/**
 * Alert modal
 *
 * @param  {string} message       Message to be passed on modal
 * @return {void}
 */


/**
 * Controlls what happens with a #loader element
 *
 * @type {Object}
 */
_loader = {
  /**
   * Shows a #loader element
   * @return {void}
   */
  show: function() {
    if (document.getElementById("loader")) document.getElementById("loader").classList.remove("hidden");
  },
  /**
   * hide a #loadder element
   * @return {void}
   */
  hidden: function() {
    if (document.getElementById("loader")) document.getElementById("loader").classList.add("hidden");
  }
}

/**
 * Refreshs a page when passed to Restful function as a success callback
 *
 * @type {Object}
 */
_refresh = {
  onSucess: function() {
    4 == http.readyState && http.status >= 200 && http.status <= 299 && location.reload();
  }
}

/**
 * GET user info from localStorage
 *
 * @return {void}
 */
function update_user() {
  _user = (localStorage.logged)? JSON.parse(localStorage.logged).data : {};
}

/**
 * Direct function to do a POST HTTP request using Restful function
 *
 * @param       {string} url       URL for the request
 * @param       {object} data      info to be passed on request
 * @param       {callback} success function to be executed on success
 * @param       {callback} fail    function to be executed on fail
 * @return      {void}
 */
function _post(url, data, success, fail, token) {
  Restful('POST', url, data, success, fail, null, null, token);
}

/**
 * Direct function to do a GET HTTP request using Restful function
 *
 * @param       {string} url       URL for the request
 * @param       {object} data      info to be passed on request
 * @param       {callback} success function to be executed on success
 * @param       {callback} fail    function to be executed on fail
 * @return      {void}
 */
function _get(url, data, success, fail, controlloader) {
  Restful('GET', url, data, success, fail, controlloader);
}

/**
 * This function will execute Restful calls using the ajaxCall function
 *
 * @param       {string} method    HTTP method
 * @param       {string} url       URL for the request
 * @param       {object} data      info to be passed on request
 * @param       {callback} success function to be executed on success
 * @param       {callback} fail    function to be executed on fail
 * @return      {void}
 */
function Restful(method, url, data, success, fail, controlloader, noloader, token) {
    var http = ajaxCall(method, url, data, noloader, token);

    http.onreadystatechange = function() {
        if (!controlloader) _loader.hidden();
        if (http.readyState == 4 && http.status >= 200 && http.status <= 299) {
          if (success && isFunction(success)) success(http);
          else alert("Operação finalizada com Sucesso!");
        } else if (http.readyState == 4 && http.status >= 400 && http.status <= 499) {
          if (fail && isFunction(fail)) fail(http)
          else alert("Erro na solicitação. CODE: " + String(http.status));
        } else if (http.readyState == 4 && http.status >= 500 && http.status <= 599) {
          if (fail && isFunction(fail)) fail(http)
          else  alert("Erro Interno no Servidor. CODE: " + String(http.status));
        } else if (http.readyState == 4) {
          if (fail && isFunction(fail)) fail(http)
          else alert("Erro! CODE: " + String(http.status));
        }
    }
}

/**
 * This function will execute Auth requests using the ajaxCall function
 *
 * @param       {string} method     HTTP method
 * @param       {string} url        URL for the request
 * @param       {object} data       info to be passed on request
 * @param       {callback} success  function to be executed on success
 * @param       {callback} fail     function to be executed on fail
 * @return      {void}
 */
function Auth(method, url, data, success, fail) {
  var http = ajaxCall(method, url, data);

  http.onreadystatechange = function() {
    _loader.hidden();
    if (http.readyState == 4 && http.status >= 200 && http.status <= 299) {
      if (success && isFunction(success)) success(http.response);
      else alert("Operação realizada com Sucesso!");
    } else if (http.readyState == 4 && http.status >= 401 && http.status <= 403) {
      if (fail && isFunction(fail)) fail();
      else alert("Não foi possível concluir a solicitação. Verifique sua senha.", "close-only")
    } else if (http.readyState == 4 && http.status >= 400 && http.status <= 499) {
      if (fail && isFunction(fail)) fail();
      else alert("Houve um erro. Por favor, verifique os dados e tente novamente.", "close-only")
    } else if (http.readyState == 4 && http.status >= 500 && http.status <= 599) {
      if (fail && isFunction(fail)) fail();
      else alert("Erro Interno no Servidor. CODE: " + String(http.status));
    } else if (http.readyState == 4) {
      if (fail && isFunction(fail)) fail();
      else alert("Erro! CODE: " + String(http.status));
    }
  }
}

function recoveryPass(entity, data, success, fail) {
  _get("/api/auth/1.0/" + entity + "/email/" + data.username, data, function(response) {
    if (success && isFunction(success)) success(http.response);
    else {
      alert('Verifique seu e-mail para confirmar a recuperação de senha.', "/login");
    }
  }, fail);
}

/**
 * Login method
 * @param  {[type]} entity  [description]
 * @param  {[type]} data    [description]
 * @param  {[type]} success [description]
 * @param  {[type]} fail    [description]
 * @return {[type]}         [description]
 */
function login(entity, data, success, fail) {
  Auth("POST", "/api/auth/1.0/" + entity + "/email", data, function(response) {
    localStorage.setItem("logged", response);
    update_user();
    if (success && isFunction(success)) success(response);
  });
}

/**
 * Register function
 *
 * @param  {[type]} entity
 * @param  {[type]} data
 * @param  {[type]} success
 * @param  {[type]} fail
 * @return {[type]}
 */
function register(entity, data, success, fail) {
  if (!(success && isFunction(success))) success = function(http) {
    alert("Verifique seu e-mail para confirmar o cadastro.")
  }

  Restful("POST", "/api/register/1.0/" + entity + "/", data, success);
}

/**
 * This function will execute AJAX calls using XMLHttpRequest
 *
 * @param  {string} method         HTTP request
 * @param  {string} url            URL for the request
 * @param  {object} data           info to be passed on request
 * @return {XMLHttpRequest}        request results
 */
function ajaxCall(method, url, data, noloader, token) {
    if (!noloader) {
        _loader.show();
    }
    var http = new XMLHttpRequest();
    var params = Object.keys(data).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&')
    if (token)  {
      http.open(method, url + "?" + params, true);
      http.setRequestHeader("PRIVATE-TOKEN", token);
      http.send();
    } else {
      http.open(method, url + "?access_token=" + data.access_token, true);
      http.send(JSON.stringify(data));
    }
    // console.log(JSON.stringify(data))
    return http;
}

/**
 * Verify if an object is a function
 *
 * @param  {Object}  object function object
 * @return {Boolean}        true if is a function else false
 */
function isFunction(object) {
    return !!(object && object.constructor && object.call && object.apply);
}

/**
 * Converts form content to JSON
 *
 * @param  {HTMLObject} form     form with the content
 * @param  {Function} especial   function to treat some inputs in a special way
 * @return {objectJSON}          JSON generetad by the form info
 */
function toJSON(form, especial) {
    var inputs = [].slice.call(form), formData = {};

    inputs = inputs.filter((x) => x.checked || x.type != 'checkbox')

    if (especial && isFunction(especial)) formData = especial(inputs);

    for (var i = 0; i < inputs.length; i++)
        if ("" != inputs[i].name && undefined != inputs[i].name)
            formData[inputs[i].name] = inputs[i].value;
    return formData;
}

/**
 * Function to execute password changes
 * using Auth function and toJSON function
 *
 * @param  {HTMLObject} form   Form with the password info
 * @param  {string} entity     the entity's name that will change the password
 * @param  {string} id         the entity's id that will change the password
 * @param  {string} token      User token
 * @return {void}
 */
function changePassword(form, entity, id, token) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var data = toJSON(e.target)
    if (data.new_password != data.repeat_new_password) {
      alert("As senhas não conferem, por favor, tente novamente.");
      return false;
    }

    Auth("PUT", "/api/auth/1.0/" + entity + "/" + id + "?token=" + token, data, function() {
        location.reload();
    })
  })
}

/**
 * Clear content off all inputs from a form
 *
 * @param  {HTMLObject} form  Form that contains the inputs
 * @return {void}
 */
function clearInputs(form) {
  var inputs = [].slice.call(form.childNodes);
  inputs = inputs.filter((x) => x.nodeType === 1)
  for (var i = 0; i < inputs.length; i++)
    inputs[i].value = "";
}

/**
 * Clears numerical string formating
 *
 * @param  {string} str original string
 * @return {string}     string without formatting
 */
function clearFormating(str) {
  return str.replace(/\//g, "")
    .replace("-", "")
    .replace(/\./g, "")
    .replace(/\)/g, "")
    .replace(/\(/g, "")
    .replace(/\-/g, "")
    .replace(/ /g, "")
    .replace(/[^0-9]/, "")
    .replace(' ', '')
}
