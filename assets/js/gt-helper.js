var gt = function (selector) {
  return (selector.charAt(0) == "#") ?
    document.querySelector(selector): document.querySelectorAll(selector);
};

function changeBtw(a, b) {
  gt(a).classList.add("hidden");
  gt(b).classList.remove("hidden");
}

function getSearchParameters() {
      var prmstr = window.location.search.substr(1);
      return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
    var params = {};
    var prmarr = prmstr.split("&");
    for ( var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}

var params = getSearchParameters();
