define(function (require) {

  function Helper() {
  }

  Helper.prototype.getRndInteger = function(min, max) {
    return Math.floor(Math.random() * (max + 1 - min) ) + min;
  }

  Helper.prototype.shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  Helper.prototype.removeDuplicates = function(array) {
    function onlyUnique(value, index, self) {
      var ix = self.indexOf(value);
      return ix === index;
    }

    var unique = array.filter(onlyUnique);
    return unique;
  }

  return {
    Helper: Helper
  };
})
