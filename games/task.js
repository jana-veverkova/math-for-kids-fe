define(function (require) {

  var PageHelper = require("shared/pageHelper").PageHelper;

  const e = React.createElement;

  class Task extends React.Component {
    constructor(props) {
      super(props);
      this.task = this.props.task;
    }

    render() {
      return e(
        'div',
        { className: 'task' },
        this.task
      );
    }
  }

  return {
    Task: Task
  }

})
