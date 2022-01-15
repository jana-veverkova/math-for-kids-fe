define(function (require) {

  function PageHelper() {
    this.head = document.getElementsByTagName('HEAD')[0];
    this.links = this.head.getElementsByTagName('link');
  }

  PageHelper.prototype.addCssFile = function (cssFilePath) {
    var self = this;

    var cssId = cssFilePath.split('/').pop();

    if (!document.getElementById(cssId)) {
      var link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = cssFilePath;
      link.media = 'all';
      self.head.appendChild(link);
    }
  }

  PageHelper.prototype.getUrlParameter = function(parameterName) {
    var url_string = window.location.href;
    var url = new URL(url_string);
    var c = url.searchParams.get(parameterName);
    return c;
  }

  return {
    PageHelper: PageHelper
  };
})
