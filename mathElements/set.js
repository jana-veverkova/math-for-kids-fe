define(function (require) {

  const e = React.createElement;

  class Set extends React.Component {
    constructor(props) {
      super(props);
      this.elements = this.props.elements;
    }

    render() {
      return e(
        'div',
        { className: 'set' },
        this.elements
      );
    }
  }

  return {
    Set: Set
  }

})
