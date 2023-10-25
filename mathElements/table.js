define(function (require) {

  const e = React.createElement;

  class Table extends React.Component {
    constructor(props) {
      super(props);
      this.elements = this.props.elements;
      this.rowsCount = this.props.rowsCount;
      this.colsCount = this.props.colsCount;
    }

    render() {
      let self = this;
      return e(
        'div',
        { className: 'table' },
        Array(self.rowsCount).fill().map(function(x,row) {
            return e(
              'div',
              {className: 'table-row'},
              Array(self.colsCount).fill().map(function(y, col) {
              return e(
                'div',
                {className: 'table-item'},
                self.elements[col + row * self.colsCount]
              )
            })
            )
          }
          )
      );
    }
  }

  return {
    Table: Table
  }

})
