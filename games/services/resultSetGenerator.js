define(function (require) {

  const e = React.createElement;

  let Helper = require("shared/helper").Helper;
  let StringElement = require("mathElements/stringElement").StringElement;

  function ResultSetGenerator() {
    this.helper = new Helper();
  }

  // returns [resultSetComponents]
  ResultSetGenerator.prototype.generateResultSet = function(params, answerValue) {
    let self = this;

    let resultSetValues = [];

    if (params.elements) {
      resultSetValues = params.elements;
    }

    if (params.min != undefined && params.max != undefined && params.numberOfElements != undefined) {
      let min = params.min;
      let max = params.max;
      let numberOfElements = params.numberOfElements;

      for (let i = min; i < max + 1; i++) {
        resultSetValues.push(i);
      }

      self.helper.shuffleArray(resultSetValues);
      resultSetValues = resultSetValues.slice(0, numberOfElements);
    }

    var answerIx = resultSetValues.indexOf(answerValue);
    if (answerIx == -1) {
      answerIx = self.helper.getRndInteger(0, resultSetValues.length - 1);
      resultSetValues[answerIx] = answerValue;
    }

    let components = resultSetValues.map(
        function(item, index) {
          return e(StringElement, { key: 'resultSetItem_' + index.toString(), value: item})
        }
      );

      document.addEventListener('resultSetItemClick', function(ev) {
        if (ev.detail.item == components[answerIx]) {
          let finish = window.confirm('Vyhrals!');
          if (finish) {
            document.dispatchEvent(new CustomEvent('gameFinished'));
          }
        } else {
          let finish = window.confirm('Prohrals!');
          if (finish) {
            document.dispatchEvent(new CustomEvent('gameFinished'));
          }
        }
      });

      return components;
    }

  return {
    ResultSetGenerator: ResultSetGenerator
  }

})
