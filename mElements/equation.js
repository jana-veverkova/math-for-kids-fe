define(function (require) {

  var PageHelper = require("shared/pageHelper").PageHelper;

  const e = React.createElement;

  class Equation extends React.Component {
    constructor(props) {
      super(props);
      this.leftSide = this.props.leftSide;
      this.rightSide = this.props.rightSide;

      new PageHelper().addCssFile('mElements/mElement.css');
    }

    render() {
      return e(
        'div',
        { className: 'equation' },
        e(
          'div',
          { className: 'equation-left-side' },
          this.leftSide
        ),
        e(
          'div',
          { className: 'element equals' },
          '='
        ),
        e(
          'div',
          { className: 'equation-right-side' },
          this.rightSide
        )
      );
    }
  }

  return {
    Equation: Equation
  }

})
