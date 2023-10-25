requirejs.config(config);

define(function (require) {

  var LogicalSeries = require("games/logicalSeries").LogicalSeries;
  var SimpleEquation = require("games/SimpleEquation").SimpleEquation;
  var RulesFactory = require("games/logicalSeries").RulesFactory;
  var Pexeso = require("games/pexeso").Pexeso;
  var PageHelper = require("shared/pageHelper").PageHelper;
  var StringElement = require("mathElements/stringElement").StringElement;
  var PictureFactory = require("graphics/motiveFactory").MotiveFactory;
  var Expression = require("mathElements/expression").Expression;
  var Equation = require("mathElements/equation").Equation;
  var VennDiagram = require("games/vennDiagram").VennDiagram;
  var Puzzle = require("games/puzzle").Puzzle;
  var NumbersLearning = require("games/numbersLearning").NumbersLearning;
  var NumbersComparing = require("games/numbersComparing").NumbersComparing;
  var GameSequenceRunner = require("gameTree/gameSequenceRunner").GameSequenceRunner;
  var GameTree = require("gameTree/gameTree").GameTree;
  var ProgressBar = require("gameTree/statistics/progressBar").ProgressBar;

  new PageHelper().addCssFile('main.css');

  var body = document.getElementsByTagName('body')[0];
  //var gameFactory = new GameFactory();
  var min = 2;
  var max = 10;
  var onlyResult = false;
  var operators = ['+', '-'];
  var isNumerical = true;

  //var logicalSeries = new LogicalSeries([(new RulesFactory).createRepeatingRule(1, 3, true);

  var pictureFactory = new PictureFactory();

  //body.appendChild(logicalSeries.container);
  const e = React.createElement;
  const domContainer = document.querySelector('#dom_container');

  var rulesFactory = new RulesFactory();
  //var gameSequence = [
  //  {
  //    name: NumbersComparing,
  //    params: {key: 'game_1', min: 8, max: 15, isNumerical: true}
  //  }
 // ];


  ReactDOM.render(e(Puzzle,{}), domContainer);

  //ReactDOM.render(e(GameTree), domContainer);

  //ReactDOM.render(e(ProgressBar, {value: 70, className: 'a'}), domContainer);

})
