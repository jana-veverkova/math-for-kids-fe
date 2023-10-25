define(function (require) {

  const e = React.createElement;

  let Helper = require("shared/helper").Helper;
  let arithmetics = require("gameTree/mathSkills/arithmetics").arithmetics;
  let logic = require("gameTree/mathSkills/logic").logic;

  function SkillsEvaluator() {
    this.minNumberOfGames = 8;
    this.numberOfGamesConsidered = 8;

    this.helper = new Helper();

    this.mathSkills = { arithmetics, logic };
    this.skillsById = {};
    this.prerequisities = {};

    this.prerequisitesArray = new SkillPrerequisitesArray();

    var self = this;
    Object.keys(this.mathSkills).forEach(mathArea => {
      Object.keys(this.mathSkills[mathArea]).forEach(mathSubarea => {
        Object.keys(this.mathSkills[mathArea][mathSubarea]).forEach(skillKey => {

          let skill = this.mathSkills[mathArea][mathSubarea][skillKey];

          this.skillsById[skill.id] = skill;

          skill.prerequisites.forEach(function(prerequisite) {
            self.prerequisitesArray.addItem(skill.id, prerequisite.skill.id, prerequisite.requiredPercentage);
          })
        });
      });
    });

    Object.keys(this.skillsById).forEach(id => {
      let skill = this.skillsById[id];
      this.evaluate(skill);
    });
  }

  SkillsEvaluator.prototype.evaluate = function(skill) {
    this._evaluateLearnedPercentage(skill);
    this._evaluateTheLock(skill);
    this._evaluatePrerequisite(skill);
  }

  SkillsEvaluator.prototype.updateTrainingResults = function(results) {
    let self = this;
    results.forEach(function(result) {
      let skill = self.skillsById[result.skillId];
      if (skill.trainings.length == self.minNumberOfGames) {
        skill.trainings = skill.trainings.slice(1);
      }
      skill.trainings.push(result.isWon);
      self.evaluate(skill);
    })
  }

  SkillsEvaluator.prototype._evaluateLearnedPercentage = function(skill) {
    let self = this;
      if (skill.trainings) {
        let sum = 0;
        skill.trainings.forEach(function(val) {
          sum = sum + val;
        });
        skill.learnedPercentage = (sum/self.minNumberOfGames)*100;
      } else {
        skill.trainings = [];
        skill.learnedPercentage = 0;
      }
  }

  SkillsEvaluator.prototype._evaluatePrerequisite = function(prerequisite) {
    let self = this;
    let updatedParentSkillIds = self.prerequisitesArray.evaluatePrerequisite(prerequisite.id, prerequisite.learnedPercentage);
    updatedParentSkillIds.forEach(function(skillId) {
      self._evaluateTheLock(self.skillsById[skillId]);
    })
  }

  SkillsEvaluator.prototype._evaluateTheLock = function(skill) {
    if (skill.prerequisites.length == 0) {
      skill.locked = false;
      return;
    }
    let locked = false;
    let prereqs =this.prerequisitesArray.getItemsByParentId(skill.id);
    prereqs.forEach(function(prereq) {
      if(prereq.finished == false) {
        locked = true;
      }
    });
    skill.locked = locked;
  }

  function SkillPrerequisitesArray() {
    this.items = {};
    this.keysByParentId = {};
    this.keysByPrerequisiteId = {};
  }

  SkillPrerequisitesArray.prototype.addItem = function(parentId, prerequisiteId, requiredLearnedPercentage) {
    if (parentId in this.keysByParentId && prerequisiteId in this.keysByPrerequisiteId) {
      return;
    }

    let key = parentId + '&' + prerequisiteId;
    if (this.keysByParentId[parentId]) {
      this.keysByParentId[parentId].push(key);
    } else {
      this.keysByParentId[parentId] = [key];
    }
    if (this.keysByPrerequisiteId[prerequisiteId]) {
      this.keysByPrerequisiteId[prerequisiteId].push(key);
    } else {
      this.keysByPrerequisiteId[prerequisiteId] = [key];
    }

    let newItem = new SkillPrerequisite(parentId, prerequisiteId, requiredLearnedPercentage);
    this.items[key] = newItem;
  }

  SkillPrerequisitesArray.prototype.getItemsByParentId = function(parentId) {
    let self = this;
    let keys = this.keysByParentId[parentId];
    let result = [];
    if (keys) {
      keys.forEach(function (key) {
        result.push(self.items[key]);
      })
    }
    return result;
  }

  SkillPrerequisitesArray.prototype.getItemsByPrerequisiteId = function(prerequisiteId) {
    let self = this;
    let keys = this.keysByPrerequisiteId[prerequisiteId];
    let result = [];
    if (keys) {
      keys.forEach(function (key) {
        result.push(self.items[key]);
      })
    }
    return result;
  }

  SkillPrerequisitesArray.prototype.evaluatePrerequisite = function(prerequisiteId, learnedPercentage) {
    let self = this;
    let keys = this.keysByPrerequisiteId[prerequisiteId];
    let updatedSkills = [];
    if (keys) {
      keys.forEach(function (key) {
        self.items[key].evaluate(learnedPercentage);
        if (self.items[key].finished) {
          updatedSkills.push(self.items[key].parentId);
        }
      });
    }
    return updatedSkills;
  }

  function SkillPrerequisite(parentId, prerequisiteId, requiredLearnedPercentage) {
    this.parentId = parentId;
    this.prerequisiteId = prerequisiteId;
    this.requiredLearnedPercentage = requiredLearnedPercentage;
    this.finished = false;
  }

  SkillPrerequisite.prototype.evaluate = function(learnedPercentage) {
    if (this.requiredLearnedPercentage <= learnedPercentage) {
      this.finished = true;
    }
  }

  return {
    SkillsEvaluator: SkillsEvaluator
  }

})

