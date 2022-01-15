define(function (require) {

  var PageHelper = require("shared/pageHelper").PageHelper;
  var Button = require("control/button").Button;

  const e = React.createElement;

  class GameReact extends React.Component {
    constructor(props) {
      super(props);
      this.game = this.props.game;
    }

    render() {
      return e(
        'div',
        { className: 'game' },
        this.game
      );
    }
  }

  function Game() {
    new PageHelper().addCssFile('games/game.css');

    this.container = this.render();
  }

  Game.prototype.render = function () {
    var self = this;

    var gameContainer = document.createElement('div');
    gameContainer.classList.add('game');

    return gameContainer;
  }

  Game.prototype.addTask = function (task) {
    var self = this;

    var taskContainer = document.createElement('div');
    taskContainer.classList.add('task');
    taskContainer.appendChild(task.container);
    self.container.appendChild(taskContainer);
  }

  Game.prototype.addResultSet = function(resultSetArray) {
    var self = this;

    var resultSetContainer = document.createElement('div');
    resultSetContainer.classList.add('result-set');
    self.container.appendChild(resultSetContainer);

    resultSetArray.forEach(function(item) {
      resultSetContainer.appendChild((item.container));
    });
  }

  Game.prototype.addSubmitPanel = function(onSubmitFunc) {
    var self = this;

    self.submitPanel = document.createElement('div');
    self.submitPanel.classList.add('submit-panel');
    self.container.appendChild(self.submitPanel);

    var commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    self.submitPanel.appendChild(commentDiv);

    var btnSubmit = new Button('btnSubmit', 'Hotovo');
    btnSubmit.control.addEventListener('click', onSubmitFunc);
    self.submitPanel.appendChild(btnSubmit.control);
  }

  Game.prototype.win = function() {
    var self = this;
    self.submitPanel.appendChild(document.createTextNode('Správně!'));
  }

  Game.prototype.loose = function() {
    var self = this;
    self.submitPanel.appendChild(document.createTextNode('Špatně!'));
  }

  return {
    Game: Game
  }

})
