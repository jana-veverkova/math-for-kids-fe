define(function (require) {

  const e = React.createElement;

  class ProgressBar extends React.Component {
    constructor(props) {
      super(props);
      this.state = { value: this.props.value };
      this.className = this.props.className;
    }

    render() {
      var self = this;

      return e(
        'div',
        { className: 'progress-bar-container ' + this.props.className },
        e('div', {className: 'progress-bar'}),
        e('div', {className: 'progress-detail'}, self.state.value + ' %')
      )
    }
  }

  return {
    ProgressBar: ProgressBar
  }

})


