requirejs.config(config);

define(function (require) {

  var LogicalSeriesReact = require("games/logicalSeries").LogicalSeriesReact;
  var Rules = require("games/logicalSeries").Rules;
  var PageHelper = require("shared/pageHelper").PageHelper;
  var StringElement = require("mElements/stringElement").StringElement;
  var PictureFactory = require("mElements/pictureFactory").PictureFactory;
  var Expression = require("mElements/expression").Expression;
  var Equation = require("mElements/equation").Equation;

  new PageHelper().addCssFile('main.css');

  var body = document.getElementsByTagName('body')[0];
  //var gameFactory = new GameFactory();
  var min = 2;
  var max = 10;
  var onlyResult = false;
  var operators = ['+', '-'];
  var isNumerical = true;


  //var logicalSeries = new LogicalSeries([LogicalSeriesRules.getIncreasingRule(1, 20, 1, 3)]);

  var pictureFactory = new PictureFactory();

  //body.appendChild(logicalSeries.container);
  const e = React.createElement;
  const domContainer = document.querySelector('#like_button_container');
  ReactDOM.render(
    e(
      LogicalSeriesReact,
      {
        rules: [
          Rules.getRepeatingRule(1, 3, true),
          Rules.getIncreasingRule(1,10, 2, 3)
        ]
      }
    ), domContainer);

})
