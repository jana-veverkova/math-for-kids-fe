define(function (require) {

  class Expression extends React.Component {
    constructor(props) {
      super(props);
      this.elements = this.props.elements;
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
