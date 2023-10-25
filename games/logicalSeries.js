define(function (require) {

  var Helper = require("shared/helper").Helper;
  var MotiveFactory = require("graphics/motiveFactory").MotiveFactory;
  var StringElement = require("mathElements/stringElement").StringElement;
  var Series = require("mathElements/series").Series;
  var Task = require("games/components/task").Task;
  var ResultSet = require("games/components/resultSet").ResultSet;
  let RandomValuesGenerator = require("games/services/RandomValuesGenerator").RandomValuesGenerator;

  const e = React.createElement;

  class LogicalSeries extends React.Component {
    constructor(props) {
      super(props);
      this.helper = new Helper();
      this.rule = this.props.rules[this.helper.getRndInteger(0, this.props.rules.length-1)];
      this.elementsCount = 6;
      this.resultSetSize = 5;

      this.motive = (new MotiveFactory()).getRandomMotive();

      this.randomValuesGenerator = new RandomValuesGenerator();

      // game
      // returns [series, answerIx]
      this.game = this.createGame();
    }

    createGame() {
      var self = this;
      var series = [];

      for (var i = 0; i < self.elementsCount; i++) {
        series = self.rule.apply(series);
      }

      var answerIx = self.helper.getRndInteger(0, self.elementsCount - 1);
      var answer = series[answerIx];

      let resultSetValues = [];

      if (self.rule.isPictorial === true) {
        resultSetValues = self.randomValuesGenerator.generate(
          1,
          self.motive.pictures.length,
          Math.min(self.motive.pictures.length, self.resultSetSize));
      } else {
        resultSetValues = self.randomValuesGenerator.generate(self.rule.min, self.rule.max, self.resultSetSize);
      }

      let ix = resultSetValues.indexOf(answer);
      if (ix == -1) {
        ix = this.helper.getRndInteger(0, resultSetValues.length - 1);
        resultSetValues[ix] = answer;
      }

      return {
        example: {series: series, answerIx: answerIx, answer: answer},
        resultSet: {
          values: resultSetValues,
          answerIx: ix
        }
      };
    }

    render() {
      var self = this;
      return e(
        'div',
        { className: `game logical-series ${this.motive.getBackgroundClass()}` },
          e(
            Task,
            { task: e(
              Series,
              { elements: self.game.example.series.map(function(item, index) {
                    if (index == self.game.example.answerIx) {
                      return e(StringElement, {key: 'element_' + index.toString(), value: '?'})
                    } else if (self.rule.isPictorial) {
                      return self.motive.createPicture(item, index)
                    } else {
                      return e(StringElement, {key: 'element_' + index.toString(), value: item})
                    }
                  }
                  )
                })
              }
            ),
        e(
          ResultSet,{
            items: self.game.resultSet.values.map(
              function(item, index) {
                if (self.rule.isPictorial) {
                  return self.motive.createPicture(item, index)
                } else {
                  return e(StringElement, {key: 'resultSetItem_' + index.toString(), value: item})
                }
              }
            ),
            answerIx: self.game.resultSet.answerIx,
            ref: self.resultSetComponent
          }
        ),
        e(
          'div',
          {className: `background-motive ${this.motive.getBackgroundMotiveClass()}`}
        )
      )
    }
  }

  function RulesFactory() { }

  RulesFactory.prototype.createRepeatingRule = function (min, max, isPictorial, skipMin, skipMax) {
    return new RepeatingRule(min, max, isPictorial, skipMin, skipMax);
  }

  RulesFactory.prototype.createIncreasingRule = function (min, max, minSkip, maxSkip) {
    return new RuleIncreasing(min, max, minSkip, maxSkip);
  }

  function RepeatingRule(min, max, isPictorial, skipMin, skipMax) {
    this.min = min;
    this.max = max;
    this.isPictorial = isPictorial;

    this.helper = new Helper();

    this.skip = this.helper.getRndInteger(skipMin, skipMax);
  }

  RepeatingRule.prototype.apply = function(series) {
    var self = this;

    if (series.length <= self.skip) {
      if (!self.isPictorial) {
        series.push(self.helper.getRndInteger(self.min, self.max));
      } else {
        series.push(series.length + 1);
      }
    } else {
      series.push(series[series.length - self.skip - 1]);
    }

    return series;
  }

  function RuleIncreasing(min, max, minSkip, maxSkip) {
    this.min = min;
    this.max = max;
    this.helper = new Helper();
    this.skip = this.helper.getRndInteger(minSkip, Math.min(Math.floor((max-min)/6), maxSkip));
  }

  RuleIncreasing.prototype.apply = function(series) {
    var self = this;

    if (series.length == 0) {
        series.push(self.helper.getRndInteger(self.min, self.max - (self.skip * 6)));
    } else {
      series.push(series[series.length - 1] + self.skip);
    }

    return series;
  }


  return {
    LogicalSeries: LogicalSeries,
    RulesFactory: RulesFactory
  }

})
