define(function (require) {

  const e = React.createElement;

  class ResultSetItem extends React.Component {
    constructor(props) {
      super(props);
      this.item = this.props.item;
      this.onClick = this.props.onClick;

      this.state = {active: false};
    }

    render() {
      var self = this;
      return e(
        'div',
        {
          className: 'result-set-item' + (this.state.active ? ' active' : ''),
          onClick: function () {
            self.onClick(self.item);
          }
        },
        self.item
      );
    }
  }

  return {
    ResultSetItem: ResultSetItem
  }

})
