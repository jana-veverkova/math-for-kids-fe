define(function (require) {

  var ResultSetItem = require("games/components/resultSetItem").ResultSetItem;

  const e = React.createElement;

  class ResultSet extends React.Component {
    constructor(props) {
      super(props);
      this.items = this.props.items;
      this.answerIx = this.props.answerIx;

      this.resultSetItemsComponents = React.createRef();

      this.onItemClick = this.onItemClick.bind(this);
    }

    onItemClick(item) {
      if (item == this.items[this.answerIx]) {
        document.dispatchEvent(new CustomEvent('gameFinished', { 'detail': { isWon: 1 } }));
      } else {
        document.dispatchEvent(new CustomEvent('gameFinished', { 'detail': { isWon: 0 }  }));
      }
    }

    render() {
      var self = this;

      return e(
        'div',
        { className: 'result-set' },
        self.items.map(function(item, index) {
          return e(ResultSetItem, {
            key: 'resultSetItem_' + index.toString(),
            item: item,
            onClick: self.onItemClick,
            ref: function(el) {
              if (!self.resultSetItemsComponents.current) { self.resultSetItemsComponents.current = Array(self.items.length) }
              self.resultSetItemsComponents.current.push(el) }
          })
        })
      );
    }
  }

  return {
    ResultSet: ResultSet
  }

})
