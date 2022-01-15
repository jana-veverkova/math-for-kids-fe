define(function (require) {

  var Helper = require("shared/helper").Helper;
  var Equation = require("mElements/equation").Equation;
  var Expression = require("mElements/expression").Expression;
  var PictureFactory = require("mElements/pictureFactory").PictureFactory;
  var StringElement = require("mElements/stringElement").StringElement;
  var Set = require("mElements/set").Set;
  var Task = require("games/task").Task;
  var ResultSet = require("games/resultSet").ResultSet;

  const e = React.createElement;

  class SimpleEquation extends React.Component {
    constructor(props) {
      super(props);
      this.min = this.props.min;
      this.max = this.props.max;
      this.operators = this.props.operators;
      this.askResultOnly = this.props.askResultOnly;
      this.isNumerical = this.props.isNumerical;

      this.pictureFactory = new PictureFactory();
      this.createGame();
      this.createResultSet();
    }

    createGame() {
      this.helper = new Helper();

      this.operator = this.operators[this.helper.getRndInteger(0, this.operators.length - 1)];

      this.result = this.helper.getRndInteger(this.min, this.max);
      this.firstNumber = this.helper.getRndInteger(this.min, this.result - 1);
      this.secondNumber = this.result - this.firstNumber;

      if (this.operator == '-') {
        var firstNumber = this.firstNumber;
        var result = this.result;
        this.firstNumber = result;
        this.result = firstNumber;
      }

      this.answer = this.askResultOnly ? 'result' :
        ['firstNumber', 'secondNumber', 'result'][this.helper.getRndInteger(0, 2)];
      this.answerValue = this.answer == 'firstNumber' ? this.firstNumber : (
        this.answer == 'secondNumber' ? this.secondNumber : this.result
      );
    }

    createResultSet() {
      this.resultSet = [];

      var indexOfResult = this.helper.getRndInteger(0, 4);

      var gameRange = [];
      for (var i = this.min; i < this.max + 1; i++) {
        if (this.answerValue != i) {
          gameRange.push(i);
        }
      }

      this.helper.shuffleArray(gameRange);

      var j = 0;
      for (var i = 0; i < 5; i++) {
        if (i == indexOfResult) {
          this.resultSet.push(this.answerValue);
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
            Equation,
              { leftSide: e(
                Expression,
                  { elements: [
                      this.answer == 'firstNumber' ? e(StringElement, { key: 'firstNumber', value: '?' }) : (
                        this.isNumerical ? e(StringElement, { key: 'firstNumber', value: this.firstNumber }) : (
                          e(Set, {elements: Array(this.firstNumber).fill(self.pictureFactory.createPicture(1))})
                        )
                      ),
                      e(StringElement, { key: 'operator', value: this.operator }),
                      this.answer == 'secondNumber' ? e(StringElement, { key: 'secondNumber', value: '?' }) : (
                        this.isNumerical ? e(StringElement, { key: 'secondNumber', value: this.firstNumber }) : (
                          e(Set, {elements: Array(this.secondNumber).fill(self.pictureFactory.createPicture(1))})
                        )
                      )
                    ]}
                ),
                rightSide: this.isNumerical ? e(StringElement, { key: 'result', value: this.answer == 'result' ? '?' : this.result }) : (
                    e(Set, {elements: Array(this.result).fill(self.pictureFactory.createPicture(1))})
                  )
              }
            )
          }
        ),
        e(
          ResultSet,
          {
            resultSet: this.resultSet.map(function(item) { return e(StringElement, { value: item }) }),
            answer: this.answerValue
          }
        )
      );
    }
  }

  return {
    SimpleEquation: SimpleEquation
  }

})
