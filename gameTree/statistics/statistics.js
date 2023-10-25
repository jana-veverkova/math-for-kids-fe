define(function (require) {

  const e = React.createElement;

  class Statistics extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        statistics: this.props.statistics,
      };
    }

    render() {
      var self = this;

      return e(
        'div',
        { className: 'statistics' },

      )
      if (!self.state.playGames) {
        return
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
      } else {
        return e(GameSequenceRunner, {onGamesFinished: self.onGamesFinished}, self.gamesToPlay);
      }
    }
  }

  class StatisticItem extends React.Component {
    constructor(props) {
      super(props);
      this.text = this.props.text;
      this.value = this.props.value;
    }

    render() {
      var self = this;

      return e(
        'div',
        { className: 'statistic-item' },
        self.text,

      )
      if (!self.state.playGames) {
        return
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
      } else {
        return e(GameSequenceRunner, {onGamesFinished: self.onGamesFinished}, self.gamesToPlay);
      }
    }
  }

  class ProgressBar extends React.Component {
    constructor(props) {
      super(props);
      this.text = this.props.text;
      this.value = this.props.value;
    }

    render() {
      var self = this;

      return e(
        'div',
        { className: 'statistic-item' },
        self.text,

      )
      if (!self.state.playGames) {
        return
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
      } else {
        return e(GameSequenceRunner, {onGamesFinished: self.onGamesFinished}, self.gamesToPlay);
      }
    }
  }

  return {
    GameTree: GameTree
  }

})


