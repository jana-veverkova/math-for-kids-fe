define(function (require) {

  let Prerequisite = require("gameTree/mathSkills/prerequisite").Prerequisite;
  let LogicalSeries = require("games/logicalSeries").LogicalSeries;
  let RulesFactory = require("games/logicalSeries").RulesFactory;

  var rulesFactory = new RulesFactory();

  let logic = {};

  logic.repeatingSearies = {};
  logic.repeatingSearies.simpleInnPictures = {
    id: "d1cf8456-a328-11ed-a8fc-0242ac120002",
    description: "Basic repeating logical series",
    prerequisites: [],
    games: [
      {
        name: LogicalSeries, params: {
          rules: [
            rulesFactory.createRepeatingRule(0, 5, true, 0, 1)
          ]
        }
      }
    ]
  };
  logic.repeatingSearies.standardInPictures = {
    id: "4f4ce77e-2c44-4e06-81ba-62ddd05792ec",
    description: "Standard repeating logical series",
    prerequisites: [new Prerequisite(logic.repeatingSearies.simpleInnPictures, 60)],
    games: [
      {
        name: LogicalSeries, params: {
          rules: [
            rulesFactory.createRepeatingRule(0, 5, true, 0, 2)
          ]
        }
      }
    ]
  };

  return {
    logic: logic
  }

})
