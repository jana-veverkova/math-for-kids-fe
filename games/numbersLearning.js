define(function (require) {

  let Helper = require("shared/helper").Helper;
  let MotiveFactory = require("graphics/motiveFactory").MotiveFactory;
  let Set = require("mathElements/set").Set;
  let Task = require("games/components/task").Task;
  let ResultSet = require("games/components/resultSet").ResultSet;
  let RandomValuesGenerator = require("games/services/RandomValuesGenerator").RandomValuesGenerator;
  let StringElement = require("mathElements/stringElement").StringElement;

  const e = React.createElement;

  class NumbersLearning extends React.Component {
    constructor(props) {
      super(props);
      this.min = this.props.min;
      this.max = this.props.max;
      this.resultSetSize = this.props.resultSetSize;

      this.state = { training: false };

      this.resultSetComponent = React.createRef();

      this.motive = (new MotiveFactory()).getRandomMotive();
      this.helper = new Helper();
      this.randomValuesGenerator = new RandomValuesGenerator();

      // game
      // returns {result}
      this.game = this.createGame();
    }

    createGame() {
      let result = this.helper.getRndInteger(this.min, this.max);

      let resultSetValues = this.randomValuesGenerator.generate(this.min, this.max, this.resultSetSize);

      let answerIx = resultSetValues.indexOf(result);
      if (answerIx == -1) {
        answerIx = this.helper.getRndInteger(0, resultSetValues.length - 1);
        resultSetValues[answerIx] = result;
      }

      return {
        result: result,
        resultSet: {
          values: resultSetValues,
          answerIx: answerIx
        }
      };
    }

    render() {
      let self = this;

      return e(
        'div',
        { className: `game numbers-learning ${this.motive.getBackgroundClass()}` },
        e(
          Task,
          { task: e(
              Set,
              { elements: Array(self.game.result).fill().map((x, i) => self.motive.createPicture(1, i)) }
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
    NumbersLearning: NumbersLearning
  }

})


