define(function (require) {

 let Prerequisite = function(skill, value) {
    this.skill = skill;
    this.requiredPercentage = value;
  }
  return {
    Prerequisite: Prerequisite
  }

})
