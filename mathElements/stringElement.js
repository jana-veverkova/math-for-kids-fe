define(function (require) {

  class StringElement extends React.Component {
    constructor(props) {
      super(props);
      this.value = this.props.value;
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
