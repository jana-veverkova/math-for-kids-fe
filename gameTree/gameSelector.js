define(function (require) {

  const e = React.createElement;

  let Helper = require("shared/helper").Helper;

  function GameSelector() {
    this.helper = new Helper();
  }

  GameSelector.prototype.selectGames = function(skills, numberOfGames) {
    let self = this;
    let trainableSkills = this._getTrainableSkills(skills);

    let totalPoints = 0;
    trainableSkills.forEach(function(skill) {
      totalPoints = totalPoints + (100 - skill.learnedPercentage);
    })

    let skillsWithProbability = [];
    trainableSkills.forEach(function(skill) {
      skillsWithProbability.push([skill, (100-skill.learnedPercentage)/totalPoints]);
    });

    let result = [];
    for (let i = 0; i < numberOfGames; i++) {
      let sumOfProbabilities = 0;
      let rand = Math.random();
      let game = null;
      let skillId = null;
      let j = 0;
      while (game == null && j < skillsWithProbability.length) {
        sumOfProbabilities = sumOfProbabilities + skillsWithProbability[j][1];
        if (sumOfProbabilities >= rand) {
          let games = skillsWithProbability[j][0].games;
          game = self.helper.shuffleArray(games)[0];
          skillId = skillsWithProbability[j][0].id;
        } else {
          j++;
        }
      }
      result.push({ skillId: skillId, game: game} );
    }

    return result;
  }

  GameSelector.prototype._getTrainableSkills = function(skills) {
    let self = this;

    let trainableSkills = [];

    let checkSkill = function(skill, requiredPercentage) {
      if (!skill.locked && skill.learnedPercentage < requiredPercentage) {
        if (!trainableSkills.includes(skill)) {
          trainableSkills.push(skill);
        }
      } else if (skill.locked) {
        skill.prerequisites.forEach(function(prerequisite) {
          checkSkill(prerequisite.skill, prerequisite.requiredPercentage);
        })
      }
    }

    skills.forEach(function(skill) {
      checkSkill(skill, 100);
    });

    return trainableSkills;
  }

  return {
    GameSelector: GameSelector
  }

})

