define(function (require) {

  const e = React.createElement;

  let TreeNode = require("gameTree/treeNode").TreeNode;
  let SkillsEvaluator = require("gameTree/skillsEvaluator").SkillsEvaluator;
  let GameSelector = require("gameTree/gameSelector").GameSelector;
  let GameSequenceRunner = require("gameTree/gameSequenceRunner").GameSequenceRunner;

  class GameTree extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        playGames: false,
      };

      this.skillsEvaluator = new SkillsEvaluator();
      this.gameSelector = new GameSelector();

      this.nodes = this.createNodes();

      this.onNodeClick = this.onNodeClick.bind(this);
      this.onGamesFinished = this.onGamesFinished.bind(this);

      let nodeComponents = {};
      Object.keys(this.nodes).forEach(nodeId => {
        nodeComponents[nodeId] = React.createRef();
      });
      this.nodeComponents = nodeComponents;
    }

    createNodes() {
      let self = this;

      let arithmetics = self.skillsEvaluator.mathSkills.arithmetics;
      let logic = self.skillsEvaluator.mathSkills.logic;

      let nodes = {};
      nodes.node1_1 = { order: 1, classId: 1, skills: [] };
      nodes.node1_2 = { order: 2, classId: 1, skills: [] };
      nodes.node1_3 = { order: 3, classId: 1, skills: [] };
      nodes.node1_4 = { order: 4, classId: 1, skills: [] };
      nodes.node1_5 = { order: 5, classId: 1, skills: [] };
      nodes.node1_6 = { order: 6, classId: 1, skills: [] };
      nodes.node1_7 = { order: 7, classId: 1, skills: [] };

      nodes.node1_1.skills.push(arithmetics.learningNumbers.upTo3);
      nodes.node1_1.skills.push(arithmetics.learningNumbers.upTo5);
      nodes.node1_1.skills.push(arithmetics.learningNumbers.upTo10);
      nodes.node1_1.skills.push(arithmetics.comparingNumbers.upTo5inPictures);
      nodes.node1_1.skills.push(arithmetics.comparingNumbers.upTo10inPictures);
      nodes.node1_1.skills.push(arithmetics.comparingNumbers.upTo5);
      nodes.node1_1.skills.push(arithmetics.comparingNumbers.upTo10);
      nodes.node1_1.skills.push(logic.repeatingSearies.simpleInnPictures);
      nodes.node1_2.skills.push(logic.repeatingSearies.standardInPictures);

      Object.keys(nodes).forEach(function(nodeId) {
        let node = nodes[nodeId];
        self.evaluateLearnedPercentage(node);
        self.evaluateTheLock(node);
      });

      return nodes;
    }

    evaluateTheLock(node) {
      let locked = true;
      node.skills.forEach(function(skill) {
        if (skill.locked == false) {
          locked = false;
        }
      });
      node.locked = locked;
    }

    evaluateLearnedPercentage(node) {
      let skillsCount = 0;
      let percentage = 0;
      node.skills.forEach(function(skill) {
        skillsCount++;
        percentage = percentage + skill.learnedPercentage;
      });
      node.learnedPercentage = (percentage/(skillsCount*100))*100;
    }

    onNodeClick(nodeId) {
      let node = this.nodes[nodeId];
      this.gamesToPlay = this.gameSelector.selectGames(node.skills, 5);
      this.setState({
        playGames: true,
      });
    }

    onGamesFinished(result) {
      let self = this;
      self.skillsEvaluator.updateTrainingResults(result);

      Object.keys(self.nodeComponents).forEach(nodeId => {
        let node = self.nodes[nodeId];
        self.evaluateLearnedPercentage(node);
        self.evaluateTheLock(node);
      });

      self.setState({
        playGames: false,
      });
    }

    render() {
      var self = this;

      if (!self.state.playGames) {
        return e(
          'div',
          {className: 'game-tree-container'},
          e(
            'div',
            {className: 'game-tree-box'},
            e(
              'div',
              {className: 'game-tree'},

              Object.keys(self.nodes).map((nodeId, i) => e(TreeNode, {
                key: nodeId,
                treeNodeId: nodeId,
                classId: self.nodes[nodeId].classId,
                locked: self.nodes[nodeId].locked,
                learnedPercentage: self.nodes[nodeId].learnedPercentage,
                onClick: self.onNodeClick,
                ref: self.nodeComponents[nodeId]
              }))
            )
          ),
          e(
            'div',
            {className: 'sidebar'},
            Object.keys(self.skillsEvaluator.skillsById).map(skillId => e('div',
              {},
              self.skillsEvaluator.skillsById[skillId].description + ' => ' +
            self.skillsEvaluator.skillsById[skillId].learnedPercentage +
            self.skillsEvaluator.skillsById[skillId].locked))
          )
        )
      } else {
        return e(GameSequenceRunner, {onGamesFinished: self.onGamesFinished}, self.gamesToPlay);
      }
    }
  }

  return {
    GameTree: GameTree
  }

})


