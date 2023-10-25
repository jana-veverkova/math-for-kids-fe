define(function (require) {

  var Helper = require("shared/helper").Helper;
  var Equation = require("mathElements/equation").Equation;
  var Expression = require("mathElements/expression").Expression;
  let MotiveFactory = require("graphics/motiveFactory").MotiveFactory;
  var StringElement = require("mathElements/stringElement").StringElement;
  var Set = require("mathElements/set").Set;
  var Task = require("games/components/task").Task;
  var ResultSet = require("games/components/resultSet").ResultSet;
  let RandomValuesGenerator = require("games/services/RandomValuesGenerator").RandomValuesGenerator;

  const e = React.createElement;

  class SimpleEquation extends React.Component {
    constructor(props) {
      super(props);
      this.min = this.props.min;
      this.max = this.props.max;
      this.operators = this.props.operators;
      // askResultOnly
      // true - only the result of the equation is unknown variable
      this.askResultOnly = this.props.askResultOnly;
      this.isNumerical = this.props.isNumerical;
      this.resultSetSize = 5;

      this.motive = (new MotiveFactory()).getRandomMotive();
      this.helper = new Helper();
      this.randomValuesGenerator = new RandomValuesGenerator();

      // game
      this.game = this.createGame();
    }

    createGame() {
      var example = null;

      var operator = this.operators[this.helper.getRndInteger(0, this.operators.length - 1)];

      var value = this.helper.getRndInteger(this.min, this.max);
      var firstNumber = this.helper.getRndInteger(this.min, value - 1);
      var secondNumber = value - firstNumber;

      var operands = [];
      var result = null;
      if (operator == '+') {
        operands =  [firstNumber, secondNumber];
        result = value;
      } else if (operator == '-') {
        operands = [value, firstNumber];
        result = secondNumber;
      }

      var operators = [operator];

      // create answer

      var answerIx = this.askResultOnly ? null : this.helper.getRndInteger(0, operands.length-1);
      var answer = this.askResultOnly ? null : operands[answerIx];

      let resultSetValues = this.randomValuesGenerator.generate(this.min, this.max, this.resultSetSize);

      let ix = resultSetValues.indexOf(answer);
      if (ix == -1) {
        ix = this.helper.getRndInteger(0, resultSetValues.length - 1);
        resultSetValues[ix] = answer;
      }

      return {
        example:{ operands: operands, operators: [operator], result: result, answerIx: answerIx, answer: answer },
        resultSet: {
          values: resultSetValues,
          answerIx: ix
        }
      };
    }

    createLeftSideExpression() {
      var self = this;
      var result = [];

      self.game.example.operands.forEach(function(operand, index) {
        if (index == self.game.example.answerIx) {
          result.push(e(StringElement, { key: 'element_' + index.toString(), value: '?' }));
        } else if (self.isNumerical || operand == 0) {
          result.push(e(StringElement, { key: 'element_' + index.toString(), value: operand }))
        } else {
          result.push(e(Set, { key: 'element_' + index.toString(), elements: Array(operand).fill(self.motive.createPicture(1))}));
        }

        if (self.game.example.operators[index]) {
          result.push(e(StringElement, { key: 'operator_' + index.toString(), value: self.game.example.operators[index] }));
        }
      })

      return result;
    }

    render() {
      var self = this;

      return e(
        'div',
        { className: `game simple-equation ${this.motive.getBackgroundClass()}` },
        e('div', self.game.example.operands),
        e(
          Task,
          { task: e(
            Equation,
              { leftSide: e(
                Expression,
                  { elements: this.createLeftSideExpression() }
                ),
                rightSide: (this.isNumerical || this.game.example.result == 0) ? e(StringElement, { key: 'rightSideElement', value: this.askResultOnly ? '?' : this.game.example.result }) : (
                    e(Set, {key: 'rightSideElement', elements: Array(this.game.example.result).fill(self.motive.createPicture(1))})
                  )
              }
            )
          }
        ),
        e(
          ResultSet,{
            items: self.game.resultSet.values.map(
              function(item, index) {
                return e(StringElement, { key: 'resultSetItem_' + index.toString(), value: item})
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
      );
    }
  }

  return {
    SimpleEquation: SimpleEquation
  }

})


