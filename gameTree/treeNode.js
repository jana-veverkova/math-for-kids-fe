define(function (require) {

  const e = React.createElement;

  class TreeNode extends React.Component {
    constructor(props) {
      super(props);
      this.id = this.props.treeNodeId;
      this.classId = this.props.classId;
      this.onClick = this.props.onClick;
      this.state = {
        locked: this.props.locked,
        learnedPercentage: this.props.learnedPercentage
      };
    }

    updateNode(params) {
      this.setState({
        locked: params.locked,
        learnedPercentage: params.learnedPercentage
      });
    }

    render() {
      var self = this;

      return e(
        'div',
        {
          className: 'game-node',
          style: {backgroundImage: `url(${'graphics/img/' + self.id + '.png'}), linear-gradient(to top, var(--gametree-class-${self.classId}) ${self.state.learnedPercentage}%, white 0%)`},
          id: self.id,
          onClick:
            function() {
              self.onClick(self.id);
            }
        },
        "Tady je node " + self.id + self.state.locked + self.state.learnedPercentage
      );
    }
  }

  return {
    TreeNode: TreeNode
  }

})


