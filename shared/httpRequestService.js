
define(function () {

  function HttpRequestService() {
  }

  HttpRequestService.prototype.get = function (requestUrl, successFunc, errorFunc) {
    var self = this;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () { self.onReadyStateChange(this, successFunc, errorFunc); }
    xhttp.open("GET", requestUrl, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
    return false;
  }

  HttpRequestService.prototype.post = function (requestUrl, body, successFunc, errorFunc) {
    var self = this;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () { self.onReadyStateChange(this, successFunc, errorFunc); }
    xhttp.open("POST", requestUrl, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(body));
    return false;
  }

  HttpRequestService.prototype.put = function (requestUrl, body, successFunc, errorFunc) {
    var self = this;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () { self.onReadyStateChange(this, successFunc, errorFunc); }
    xhttp.open("PUT", requestUrl, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(body));
    return false;
  }

  HttpRequestService.prototype.delete = function (requestUrl, successFunc, errorFunc) {
    var self = this;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () { self.onReadyStateChange(this, successFunc, errorFunc); }
    xhttp.open("DELETE", requestUrl, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
    return false;
  }

  HttpRequestService.prototype.onReadyStateChange = function (xhttp, successFunc, errorFunc) {
    var self = this;
    if (xhttp.readyState == 4) {
      if (xhttp.status == 200 || xhttp.status == 204) {
        successFunc(JSON.parse(xhttp.responseText));
      }
      else if (xhttp.status == 400 || xhttp.status == 409 || xhttp.status == 500) {
        if (errorFunc) {
          errorFunc(JSON.parse(xhttp.responseText).Message);
        } else {
          window.alert(JSON.parse(xhttp.responseText).Message);
        }
      }
    }
  }

  return {
    HttpRequestService: HttpRequestService
  }

});
