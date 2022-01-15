define(function (require) {

  var PageHelper = require("shared/pageHelper").PageHelper;

  class Expression extends React.Component {
    constructor(props) {
      super(props);
      this.elements = this.props.elements;

      new PageHelper().addCssFile('mElements/mElement.css');
    }

    render() {
      return React.createElement(
        'div',
        { className: 'expression' },
        this.elements
      )
    }
  }

  return {
    Expression: Expression
  }

})
