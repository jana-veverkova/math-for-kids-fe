define(function (require) {

  const e = React.createElement;

  let Helper = require("shared/helper").Helper;

  function RandomValuesGenerator() {
    this.helper = new Helper();
  }

  RandomValuesGenerator.prototype.generate = function(min, max, count) {
    let self = this;

    let randomValues = [];

    for (let i = min; i < max + 1; i++) {
      randomValues.push(i);
    }

    self.helper.shuffleArray(randomValues);
    randomValues = randomValues.slice(0, count);

    return randomValues;
  }

  return {
    RandomValuesGenerator: RandomValuesGenerator
  }

})
