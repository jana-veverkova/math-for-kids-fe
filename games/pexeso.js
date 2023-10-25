define(function (require) {

  var Helper = require("shared/helper").Helper;
  let MotiveFactory = require("graphics/motiveFactory").MotiveFactory;
  var StringElement = require("mathElements/stringElement").StringElement;
  var Set = require("mathElements/set").Set;
  var Task = require("games/components/task").Task;

  const e = React.createElement;

  class Pexeso extends React.Component {
    constructor(props) {
      super(props);
      this.min = this.props.min;
      this.max = this.props.max;
      this.cardsCount = 2* Math.floor(this.props.cardsCount/2);
      this.withTurnedCards = this.props.isTurned;
      this.withHint = this.props.withHint;

      this.remainingCardsCount = this.cardsCount;
      this.selectedCard = null;
      this.lastWrongCards = [];

      this.handleOnCardClick = this.handleOnCardClick.bind(this)

      this.motive = (new MotiveFactory()).getRandomMotive();
      this.helper = new Helper();

      // game
      // returns [cardValues, resultValue]
      this.game = this.createGame();
    }

    createGame() {
      var self = this;
      var resultValue = self.helper.getRndInteger(self.min, self.max);

      var cardsValues = [];
      for (var i = 0; i < (self.cardsCount/2); i++) {
        var value = self.helper.getRndInteger(self.min, resultValue)
        cardsValues.push(value);
        cardsValues.push(resultValue - value);
      }

      self.helper.shuffleArray(cardsValues);

      return { cardsValues: cardsValues, resultValue: resultValue };
    }

    handleOnCardClick(card) {
      var self = this;

      if (self.lastWrongCards.length > 0) {
        self.lastWrongCards.forEach(function(wrongCard) {
          wrongCard.setState({isWrong: false});
        });
        self.lastWrongCards = [];
      }

      card.setState({isTurnedOver: true, isSelected: true});

      // first selected card
      if (!self.selectedCard) {
        self.selectedCard = card;
        return;
      }

      // second selected card
      if (self.selectedCard) {

        // it is the same card
        if (card == self.selectedCard) {
          self.selectedCard = null;
          card.setState({isTurnedOver: self.withTurnedCards ? true : false, isSelected: false});
          return;
        }

        // it is a correct card
        if (card.value + self.selectedCard.value == self.game.resultValue) {
          card.setState({isRemoved: true});
          self.selectedCard.setState({isRemoved: true});

          self.remainingCardsCount = self.remainingCardsCount - 2;

          if (self.remainingCardsCount == 0) {
            document.dispatchEvent(new CustomEvent('gameFinished', { 'detail': { isWon: 1 } }));
          }

          // it is NOT a correct card
        }  else {
          card.setState({isSelected: false, isWrong: true});
          self.selectedCard.setState({isSelected: false, isWrong: true});
          self.lastWrongCards = [card, self.selectedCard];
        }

        self.selectedCard = null;
      }
    }

    render() {
      var self = this;

      var hintedCardsNum = 0;
      var cards = self.game.cardsValues.map(function (value, index) {
        var isHinted = false;
        if (self.withHint) {
          if (index == 0) { isHinted = true; hintedCardsNum++; }
          if (hintedCardsNum == 1 && value + self.game.cardsValues[0] == self.game.resultValue) {
            isHinted = true; hintedCardsNum++;
          }
        }
        return e(PexesoCard, {
          key: 'pexesoCard_' + index.toString(),
          motive: self.motive,
          value: value,
          isTurnedOver: self.withTurnedCards,
          isHinted: isHinted,
          handleOnClick: self.handleOnCardClick
      })});

      return e(
        'div',
        {className: `game pexeso ${this.motive.getBackgroundClass()}`},
        e(StringElement, {value: '? + ? = ' + self.game.resultValue}),
        e(
          Task,
          {
            task: e(
              Set,
              {elements: cards}
            )
          }
        ),
        e(
          'div',
          {className: `background-motive ${this.motive.getBackgroundMotiveClass()}`}
        )
      )
    }
  }

  class PexesoCard extends React.Component {
    constructor(props) {
      super(props);
      this.id = this.props.id;
      this.motive = this.props.motive;
      this.value = this.props.value;
      this.isHinted = this.props.isHinted;
      this.handleOnClick = this.props.handleOnClick;
      this.isTurnable = !this.props.isTurnedOver;
      this.state = {
        isTurnedOver: this.props.isTurnedOver,
        isSelected: false,
        isRemoved: false,
        isWrong: false
      }
    }

    componentDidMount() {
      var self = this;
      if (!self.state.isRemoved) {
        ReactDOM.findDOMNode(this).addEventListener("click", function () {
          self.props.handleOnClick(self)
        });
      }
    }

    componentDidUpdate() {
      var self = this;
      if (self.state.isWrong && self.state.isTurnedOver && self.isTurnable) {
        let timer = setTimeout(() => self.setState({isTurnedOver: false}), 2000);
      }
    }

    render() {
      var self = this;
      if (self.state.isRemoved) {
        return e('div',
          {key: 'pexesoCard_' + self.value.toString(), className: 'pexeso-card removed'},
          e(StringElement, {value: self.value})
        )
      } else {
        return e(
          'div',
          {
            className: 'pexeso-card'
              + (self.state.isTurnedOver ? ' front' : ' back')
              + (self.state.isSelected ? ' selected' : '')
              + (self.state.isWrong ? ' wrong' : '')
              + (self.isHinted ? ' hinted' : '')
          },
          self.state.isTurnedOver == true ?
            e(StringElement, {value: self.value}) :
            self.motive.createPicture(1, self.id)
        )
      }
    }
  }

  return {
    Pexeso: Pexeso
  }

})
