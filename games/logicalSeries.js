define(function (require) {

  var Helper = require("shared/helper").Helper;
  var PictureFactory = require("mElements/pictureFactory").PictureFactory;
  var StringElement = require("mElements/stringElement").StringElement;
  var Series = require("mElements/series").Series;
  var Game = require("games/game").Game;
  var Task = require("games/task").Task;
  var ResultSet = require("games/resultSet").ResultSet;

  const e = React.createElement;

  class LogicalSeriesReact extends React.Component {
    constructor(props) {
      super(props);
      this.helper = new Helper();
      this.rule = this.props.rules[this.helper.getRndInteger(0, this.props.rules.length-1)];
      this.elementsCount = 6;

      this.pictureFactory = new PictureFactory();
      this.createGame();
      this.createResultSet();
    }

    createGame() {
      this.series = [];

      for (var i = 0; i < this.elementsCount; i++) {
        this.series = this.rule.apply(this.series);
      }

      var resultIndex = this.helper.getRndInteger(0, this.elementsCount - 1);
      this.answer = this.series[resultIndex];
    }

    createResultSet() {
      this.resultSet = [];

      var indexOfResult = this.helper.getRndInteger(0, 4);

      var gameRange = [];
      for (var i = this.min; i < this.max + 1; i++) {
        if (this.answer != i) {
          gameRange.push(i);
        }
      }

      this.helper.shuffleArray(gameRange);

      var j = 0;
      for (var i = 0; i < 5; i++) {
        if (i == indexOfResult) {
          this.resultSet.push(this.answer);
        } else {
          this.resultSet.push(gameRange[i])
        }
      }
    }

    render() {
      var self = this;
      return e(
        'div',
        { className: 'game' },
          e(
            Task,
            { task: e(
              Series,
              { elements: self.series.map(function(item) { return
                  item == self.answer ? e(StringElement, { value: '?'}) : (
                    self.rule.isPictorial ? self.pictureFactory.createPicture(item) :
                      e(StringElement, { value: item })
                  )
                })
              }
            )}
          ),
          e(
            ResultSet,
            {
              resultSet: this.resultSet.map(function(item) { return e(StringElement, { value: item }) }),
              answer: this.answerValue
            }
          )
      )
    }
  }

  function LogicalSeries(rules) {
    this.helper = new Helper();
    this.pictureFactory = new PictureFactory();

    this.rule = rules[this.helper.getRndInteger(0, rules.length-1)];
    this.elementsCount = 6;

    this.series = this.createSeries();

    this.game = new Game();
    this.container = this.game.container;
    this.render();
  }

  LogicalSeries.prototype.render = function () {
    var self = this;

    self.game.addTask(self.createTask());
    self.game.addResultSet(self.createResultSet());

    self.game.addSubmitPanel(function () {
      if (self.selected.value == self.result) {
        self.game.win();
      } else {
        self.game.loose();
      }
    })
  }

  LogicalSeries.prototype.createSeries = function () {
    var self = this;
    var series = [];

    for (var i = 0; i < self.elementsCount; i++) {
      series = self.rule.apply(series);
    }

    return series;
  }

  LogicalSeries.prototype.createTask = function() {
    var self = this;

    var resultIndex = this.helper.getRndInteger(0, this.elementsCount - 1);

    var series = new Series();
    for(var i = 0; i < this.elementsCount; i ++) {
      if (i == resultIndex) {
        self.result = self.series[i];
        series.addElement(new StringElement('?'));
      } else {
        if (self.rule.isPictorial) {
          series.addElement(self.pictureFactory.createPicture(self.series[i]));
        } else {
          series.addElement(new StringElement(self.series[i]));
        }
      }
    }

    return series;
  }

  LogicalSeries.prototype.createResultSet = function () {
    var self = this;

    var resultSet = [];

    const indexOfResult = self.helper.getRndInteger(0, 4);

    var gameRange = [];
    for (var i = self.rule.min; i < self.rule.max + 1; i++) {
      if (self.result != i) {
        gameRange.push(i);
      }
    }

    self.helper.shuffleArray(gameRange);

    var j = 0;
    for (var i = 0; i < 5; i++) {
      if (i == indexOfResult) {
        if (self.rule.isPictorial) {
          resultSet.push(self.pictureFactory.createPicture(self.result));
        } else {
          resultSet.push(new StringElement(self.result));
        }
      } else {
        if (self.rule.isPictorial) {
          resultSet.push(self.pictureFactory.createPicture(gameRange[i]));
        } else {
          resultSet.push(new StringElement(gameRange[i]))
        }
      }
    }
    return resultSet
  }

  function Rules() {
  }

  Rules.getRepeatingRule = function (min, max, isPictorial) {
    return new RuleRepeating(min, max, isPictorial);
  }

  Rules.getIncreasingRule = function (min, max, minSkip, maxSkip) {
    return new RuleIncreasing(min, max, minSkip, maxSkip);
  }

  function RuleRepeating(min, max, isPictorial) {
    this.min = min;
    this.max = max;
    this.isPictorial = isPictorial;
    this.helper = new Helper();
    this.skip = this.helper.getRndInteger(1, 2);
  }

  RuleRepeating.prototype.apply = function(series) {
    var self = this;

    if (series.length < self.skip + 1) {
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
    LogicalSeriesReact: LogicalSeriesReact,
    Rules: Rules
  }

})
