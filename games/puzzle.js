define(function (require) {

  var Helper = require("shared/helper").Helper;
  var Equation = require("mathElements/equation").Equation;
  var Expression = require("mathElements/expression").Expression;
  let MotiveFactory = require("graphics/motiveFactory").MotiveFactory;
  var StringElement = require("mathElements/stringElement").StringElement;
  var Set = require("mathElements/set").Set;
  var Task = require("games/components/task").Task;
  var ResultSet = require("games/components/resultSet").ResultSet;
  var Table = require("mathElements/table").Table;
  let RandomValuesGenerator = require("games/services/RandomValuesGenerator").RandomValuesGenerator;

  const e = React.createElement;

  class Puzzle extends React.Component {
    constructor(props) {
      super(props);
      //this.rowsCount = this.props.height;
      this.rowsCount = 10
      this.colsCount = 10;
      this.averageBlockSize = 5;
      this.cellsWidthPx = 30;

      this.motive = (new MotiveFactory()).getRandomMotive();
      this.helper = new Helper();
      this.randomValuesGenerator = new RandomValuesGenerator();

      // game
      this.game = this.createGame();
    }

    gaussianRandom(mean, stdev) {
      let u = 1 - Math.random(); // Converting [0,1) to (0,1]
      let v = Math.random();
      let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
      // Transform to the desired mean and standard deviation:
      return z * stdev + mean;
    }

    createGame() {
      let self = this;

      let template = new Array(self.rowsCount);
      for(var row = 0; row < self.rowsCount; row++) {
        template[row] = new Array(self.colsCount);
        for(var col = 0; col < self.colsCount; col++) {
          template[row][col] = { blockId: null, color: null };
        }
      }

      let blocks = [];

      for (let row = 0; row < self.rowsCount; row++) {
        for (let col = 0; col < self.colsCount; col++) {

          if (template[row][col].blockId != null) { continue; }

          let block = createBlock();
          addCellToBlock(row, col, block);
          if (block.size > 1) { extendBlock(block); }
          blocks.push(block);
        }
      }

      function createBlock() {
        return {
          id: blocks.length + 1,
          color: Math.floor(Math.random()*16777215).toString(16),
          cells: [],
          size: Math.max(1, Math.round(self.gaussianRandom(5, 2)))
        }
      }

      function addCellToBlock(row, col, block) {
        block.cells.push([row, col]);
        template[row][col].blockId = block.id;
        template[row][col].color = block.color;
      }

      function extendBlock(block) {
        while (block.cells.length < block.size) {
          let neighbors = getNeighbors(block);
          if (neighbors.length == 0) { break; }
          let prob = neighbors.map(x => self.helper.getRndInteger(0, 1));
          let ixs = Array.from(Array(prob.length).keys())
          while (ixs.length > 0) {
            if (block.cells.length == block.size) {
              break;
            }
            let item = self.helper.getRndInteger(0, ixs.length-1);
            let ix = ixs[item];
            if (prob[ix] == 1) {
              addCellToBlock(neighbors[ix][0], neighbors[ix][1], block);
            }
            ixs.splice(item, 1);
          }
        }
      }

      function getNeighbors(block) {
        let neighbors = [];
        block.cells.forEach(function(cell) {
          let right = [cell[0] + 1,cell[1]];
          let left = [cell[0] - 1, cell[1]];
          let top = [cell[0], cell[1] + 1];
          let bottom = [cell[0], cell[1] - 1];

          if (isAvailable(right)) { neighbors.push(right) };
          if (isAvailable(left)) { neighbors.push(left) };
          if (isAvailable(top)) { neighbors.push(top) };
          if (isAvailable(bottom)) { neighbors.push(bottom) };
        });
        return neighbors;

        function isAvailable(cell) {
          if (cell[0] < 0 || cell[0] > self.rowsCount - 1 || cell[1] < 0|| cell[1] > self.colsCount - 1) { return false }
          if (template[cell[0]][cell[1]].blockId == null && !neighbors.map(x => ''+x[0]+x[1]).includes(''+cell[0]+cell[1])) {
            return true;
          } else return false;
        }
      }

      return {
        template: template,
        blocks: blocks
      };
    }

    render() {
      var self = this;
      let templateElements = [];
      for(var i=0; i<self.colsCount; i++) {
        templateElements = templateElements.concat(self.game.template[i]);
      }
      return e(
        'div',
        { className: `game puzzle ${this.motive.getBackgroundClass()}` },
        e(
          'div',
          {
            className: `template`,
            style: {
              width: self.colsCount*self.cellsWidthPx+`px`,
              height: self.rowsCount*self.cellsWidthPx+`px`
            }
            },
            e(
              Table,
              {
                elements: templateElements.map(x => x.blockId),
                rowsCount: self.rowsCount,
                colsCount: self.colsCount
              }
            )
        ),
        e(
          'div',
          {className: `background-motive ${this.motive.getBackgroundMotiveClass()}`}
        )
      );
    }
  }

  class PuzzleBlock extends React.Component {
    constructor(props) {
      super(props);
      this.id = this.props.id;
      this.color = this.props.color;
      this.cells = this.props.cells;
      this.cellWidth = this.props.cellWidth;
      this.rowsCount = this.props.rowsCount;
      this.colsCount = this.props.colsCount;
      this.state = {
        absPosTop: 100,
        absPosLeft: 100
      }
    }

    render() {
      var self = this;
        return e(
          'div',
          {
            className: 'block',
            style: { top: `100px`, right: `0px`,
              width: self.colsCount*self.cellWidth+`px`,
              height: self.rowsCount*self.rowsCount+`px`
            }
          },
          self.state.isTurnedOver == true ?
            e(StringElement, {value: self.value}) :
            self.motive.createPicture(1, self.id)
        )
      }
    }

  class BlockCell extends React.Component {
    constructor(props) {
      super(props);
      this.cellWidth = this.props.cellWidth;
      this.rowIx = this.props.rowIx;
      this.colIx = this.props.colIx;
      this.isEmpty = this.props.isEmpty;
    }

    render() {
      var self = this;
      return e(
        'div',
        {
          className: 'block-cell',
          style: { top: `100px`, right: `0px`,
            width: self.colsCount*self.cellWidth+`px`,
            height: self.rowsCount*self.rowsCount+`px`
          }
        }
      )
    }
  }

  return {
    Puzzle: Puzzle
  }

})


