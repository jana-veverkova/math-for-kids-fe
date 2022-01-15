define(function (require) {

  var PageHelper = require("shared/pageHelper").PageHelper;

  const e = React.createElement;

  class Series extends React.Component {
    constructor(props) {
      super(props);
      this.elements = this.props.elements;
    }

    render() {
      return e(
        'div',
        { className: 'series' },
        this.elements
      );
    }
  }

  return {
    Series: Series
  }

})
