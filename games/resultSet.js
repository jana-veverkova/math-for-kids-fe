define(function (require) {

  var PageHelper = require("shared/pageHelper").PageHelper;

  const e = React.createElement;

  class ResultSet extends React.Component {
    constructor(props) {
      super(props);
      this.resultSet = this.props.resultSet;
      this.answer = this.props.answerValue;
    }

    render() {
      return e(
        'div',
        { className: 'result-set' },
        this.resultSet.map(function(item) { return e(
          'div',
          {
            className: 'result-set-item',
            onClick: function() {
              if (item == this.answer) {
                window.alert('Vyhrals!');
              }
            }
          },
          item
        )})
      );
    }
  }

  return {
    ResultSet: ResultSet
  }

})
