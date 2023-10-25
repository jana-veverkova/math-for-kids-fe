define(function (require) {

  var Prerequisite = require("gameTree/mathSkills/prerequisite").Prerequisite;
  var NumbersLearning = require("games/numbersLearning").NumbersLearning;
  var NumbersComparing = require("games/numbersComparing").NumbersComparing;
  var SimpleEquation = require("games/simpleEquation").SimpleEquation;
  var LogicalSeries = require("games/logicalSeries").LogicalSeries;
  var Pexeso = require("games/pexeso").Pexeso;
  var VennDiagram = require("games/VennDiagram").VennDiagram;

  let arithmetics = {};
  arithmetics.learningNumbers = {};

  arithmetics.learningNumbers.upTo3 = {
    id: "72bb26ba-a327-11ed-a8fc-0242ac120002",
    description: "Learning numbers from 1 up to 3",
    prerequisites: [],
    games: [
      {name: NumbersLearning, params: {min: 1, max: 3, resultSetSize: 3}}
    ]
  };

  arithmetics.learningNumbers.upTo5 = {
    id: "0f0d0664-a328-11ed-a8fc-0242ac120002",
    description: "Learning numbers from 0 up to 5",
    prerequisites: [
      new Prerequisite(arithmetics.learningNumbers.upTo3, 80)
    ],
    games: [
      {name: NumbersLearning, params: {min: 0, max: 5, resultSetSize: 3}}
    ]
  };

  arithmetics.learningNumbers.upTo10 = {
    id: "169abb74-a328-11ed-a8fc-0242ac120002",
    description: "Learning numbers from 5 up to 10",
    prerequisites: [
      new Prerequisite(arithmetics.learningNumbers.upTo5, 80)
    ],
    games: [
      {name: NumbersLearning, params: {min: 6, max: 10, resultSetSize: 3}}
    ]
  };

  arithmetics.learningNumbers.upTo15 = {
    id: "2305374a-a328-11ed-a8fc-0242ac120002",
    description: "Learning numbers from 10 up to 15",
    prerequisites: [
      new Prerequisite(arithmetics.learningNumbers.upTo10, 80)
    ],
    games: [
      {name: NumbersLearning, params: {min: 10, max: 15, resultSetSize: 5}}
    ]
  };

  arithmetics.learningNumbers.upTo20 = {
    id: "2d72bd60-a328-11ed-a8fc-0242ac120002",
    description: "Learning numbers from 15 up to 20",
    prerequisites: [
      new Prerequisite(arithmetics.learningNumbers.upTo15, 80)
    ],
    games: [
      {name: NumbersLearning, params: {min: 15, max: 20, resultSetSize: 5}}
    ]
  };

  arithmetics.comparingNumbers = {};
  arithmetics.comparingNumbers.upTo5inPictures = {
    id: "32487f82-a328-11ed-a8fc-0242ac120002",
    description: "Comparing numbers from 0 up to 5 in pictures",
    prerequisites: [
      new Prerequisite(arithmetics.learningNumbers.upTo5, 40)
    ],
    games: [
      {name: NumbersComparing, params: {min: 1, max: 5, isNumerical: false}}
    ]
  };

  arithmetics.comparingNumbers.upTo10inPictures = {
    id: "39734350-a328-11ed-a8fc-0242ac120002",
    description: "Comparing numbers from 0 up to 10 in pictures",
    prerequisites: [
      new Prerequisite(arithmetics.learningNumbers.upTo10, 40),
      new Prerequisite(arithmetics.comparingNumbers.upTo5inPictures, 80)
    ],
    games: [
      {name: NumbersComparing, params: {min: 0, max: 10, isNumerical: false}}
    ]
  };

  arithmetics.comparingNumbers.upTo5 = {
    id: "3fe7399e-a328-11ed-a8fc-0242ac120002",
    description: "Comparing numbers from 0 up to 5",
    prerequisites: [
      new Prerequisite(arithmetics.learningNumbers.upTo5, 100),
      new Prerequisite(arithmetics.comparingNumbers.upTo5inPictures, 80)
    ],
    games: [
      {name: NumbersComparing, params: {min: 0, max: 5, isNumerical: true}}
    ]
  };

  arithmetics.comparingNumbers.upTo10 = {
    id: "6a4198ce-a328-11ed-a8fc-0242ac120002",
    description: "Comparing numbers from 0 up to 10",
    prerequisites: [
      new Prerequisite(arithmetics.learningNumbers.upTo10, 100),
      new Prerequisite(arithmetics.comparingNumbers.upTo5, 80)
    ],
    games: [
      {name: NumbersComparing, params: {min: 0, max: 10, isNumerical: false}}
    ]
  }
  ;

  return {
    arithmetics: arithmetics
  }

})
