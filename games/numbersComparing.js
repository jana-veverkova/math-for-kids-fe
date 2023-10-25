define(function (require) {

  var Helper = require("shared/helper").Helper;
  var Expression = require("mathElements/expression").Expression;
  let MotiveFactory = require("graphics/motiveFactory").MotiveFactory;
  var StringElement = require("mathElements/stringElement").StringElement;
  var Set = require("mathElements/set").Set;
  var Task = require("games/components/task").Task;
  var ResultSet = require("games/components/resultSet").ResultSet;

  const e = React.createElement;

  class NumbersComparing extends React.Component {
    constructor(props) {
      super(props);
      this.min = this.props.min;
      this.max = this.props.max;
      this.isNumerical = this.props.isNumerical;

      this.motive = (new MotiveFactory()).getRandomMotive();
      this.helper = new Helper();

      // game
      this.game = this.createGame();
    }

    createGame() {
      var firstNumber = this.helper.getRndInteger(this.min, this.max);
      var secondNumber = this.helper.getRndInteger(this.min, this.max);

      var answer = null;
      if (firstNumber < secondNumber) { answer = '<'}
      if (firstNumber > secondNumber) { answer = '>'}
      if (firstNumber == secondNumber) { answer = '='}

      let resultSetValues = ['<', '=', '>'];

      return {
        example: {
          firstNumber: firstNumber,
          secondNumber: secondNumber
        },
        resultSet: {
          values: resultSetValues,
          answerIx: resultSetValues.indexOf(answer)
        }
      }
    }

    render() {
      var self = this;

      return e(
        'div',
        { className: `game numbers-comparing ${this.motive.getBackgroundClass()}` },
        e(
          Task,
          { task: e(
              Expression,
              {
                elements: [
                  this.isNumerical ? e(StringElement, {key: 'leftSideElement', value: this.game.example.firstNumber}) :
                    e(Set, {
                      key: 'leftSideElement',
                      elements: Array(this.game.example.firstNumber).fill().map((x, i) => self.motive.createPicture(1, i))
                    }),

                  e(StringElement, {key: 'mark', value: '?'}),

                  this.isNumerical ? e(StringElement, {
                      key: 'rightSideElement',
                      value: this.game.example.secondNumber
                    }) :
                    e(Set, {
                      key: 'rightSideElement',
                      elements: Array(this.game.example.secondNumber).fill().map((x, i) => self.motive.createPicture(1, i))
                    }),
                ]
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
    NumbersComparing: NumbersComparing
  }

})


