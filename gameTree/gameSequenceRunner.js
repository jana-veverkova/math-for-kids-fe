define(function (require) {

  const e = React.createElement;

  class GameSequenceRunner extends React.Component {
    constructor(props) {
      super(props);
      this.gameSequence = this.props.children;
      this.onGamesFinished = this.props.onGamesFinished;
      this.state = { activeGameIndex: 0 };

      this.result = [];

      this.gameComponent = React.createRef();

      let self = this;

      let handleGameFinished = function(ev) {
        self.result.push({
          skillId: self.gameSequence[self.state.activeGameIndex].skillId,
          isWon: ev.detail.isWon
        });
        if (self.state.activeGameIndex == 4) {
          document.removeEventListener('gameFinished', handleGameFinished);
          self.onGamesFinished(self.result);
        } else {
          self.setState({activeGameIndex: self.state.activeGameIndex + 1});
        }
      }

      document.addEventListener('gameFinished', handleGameFinished);
    }

    render() {
      var self = this;

      let currentGame = self.gameSequence[self.state.activeGameIndex].game;
      currentGame.params.ref = self.gameComponent;
      currentGame.params.key = "game_" + self.state.activeGameIndex;

      return e(
        'div',
        {
          className: 'game-sequence-runner'
        },
        e(currentGame.name, currentGame.params)
      );
    }
  }

  return {
    GameSequenceRunner: GameSequenceRunner
  }

})


