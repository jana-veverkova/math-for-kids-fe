define(function (require) {

  var PageHelper = require("shared/pageHelper").PageHelper;

  class StringElement extends React.Component {
    constructor(props) {
      super(props);
      this.value = this.props.value;

      new PageHelper().addCssFile('mElements/mElement.css');
    }

    render() {
      return React.createElement(
        'div',
        { className: 'element string' },
        `${this.value}`
      )
    }
  }

  return {
    StringElement: StringElement
  }

})
