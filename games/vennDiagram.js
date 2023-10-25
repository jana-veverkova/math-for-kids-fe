define(function (require) {

  var Helper = require("shared/helper").Helper;
  var Expression = require("mathElements/expression").Expression;
  var StringElement = require("mathElements/stringElement").StringElement;
  var Task = require("games/components/task").Task;
  var ResultSet = require("games/components/resultSet").ResultSet;
  let RandomValuesGenerator = require("games/services/RandomValuesGenerator").RandomValuesGenerator;
  let MotiveFactory = require("graphics/motiveFactory").MotiveFactory;

  const e = React.createElement;

  class VennDiagram extends React.Component {
    constructor(props) {
      super(props);
      this.min = this.props.min;
      this.max = this.props.max;
      this.operators = this.props.operators;
      this.numberOfOperands = this.props.numberOfOperands;
      this.resultSetSize = 5;

      this.motive = (new MotiveFactory()).getRandomMotive();
      this.helper = new Helper();
      this.randomValuesGenerator = new RandomValuesGenerator();

      // game
      this.game = this.createGame();
    }

    createGame() {
      var self = this;
      var a = {name: 'a', inSets: ['A'], value: null};
      var b = {name: 'b', inSets: ['B'], value: null};
      var c = {name: 'c', inSets: ['C'], value: null};
      var ab = {name: 'ab', inSets: ['A', 'B'], value: null};
      var ac = {name: 'ac', inSets: ['A', 'C'], value: null};
      var bc = {name: 'bc', inSets: ['B', 'C'], value: null};
      var abc = {name: 'abc', inSets: ['A', 'B', 'C'], value: null};

      var set1 = {name: 'A', subsets: [a, ab, ac, abc]};
      var set2 = {name: 'B', subsets: [b, ab, bc, abc]};
      var set3 = {name: 'C', subsets: [c, ac, bc, abc]};

      var setsArray = [set1, set2, set3];
      self.helper.shuffleArray(setsArray);

      var example = self.createExample(setsArray);

      var resultSubsets = [];
      example.operands.forEach(function(operand, index) {
        if (!example.operators[index - 1]) {
          resultSubsets = resultSubsets.concat(setsArray[index].subsets);
        } else {
          if (example.operators[index - 1] == '+') {
            var difference = setsArray[index].subsets.filter(value => !resultSubsets.includes(value));
            resultSubsets = resultSubsets.concat(difference);
          }
          if (example.operators[index - 1] == '-') {
            var intersection = setsArray[index].subsets.filter(value => resultSubsets.includes(value));
            resultSubsets = resultSubsets.filter(function(item) {return !intersection.includes(item)});
          }
        }
      });

      // look for sets with '-' operator first
      var remSum = example.result;
      resultSubsets.forEach(function(subset) {
        var val = self.helper.getRndInteger(0, remSum);
        subset.value = val;
        remSum = remSum - val;
      });

      // give values to all other subsets
      setsArray.forEach(function(set) {
        set.subsets.forEach(function(subset) {
          if (subset.value == null) {
            subset.value = self.helper.getRndInteger(0, Math.round(self.max - self.max/5));
          }
        })
      });

      let resultSetValues = this.randomValuesGenerator.generate(this.min, this.max, this.resultSetSize);

      let answerIx = resultSetValues.indexOf(example.result);
      if (answerIx == -1) {
        answerIx = this.helper.getRndInteger(0, resultSetValues.length - 1);
        resultSetValues[answerIx] = example.result;
      }

      return {
        setsArray: setsArray,
        example: example,
        resultSet: {
          values: resultSetValues,
          answerIx: answerIx
        }};
    }

    createExample(setsArray) {
      var operator = this.operators[this.helper.getRndInteger(0, this.operators.length - 1)];
      var result = this.helper.getRndInteger(this.min, this.max);

      return { operands: [setsArray[0].name, setsArray[1].name], operators: [operator], result: result };
    }

    componentDidMount() {
      this.createVennDiagram();
    }

    createVennDiagram() {
      var self = this;

      var graphContainer = ReactDOM.findDOMNode(this).getElementsByClassName('graph')[0];
      var rect = graphContainer.getBoundingClientRect();
      var centerx = rect.width/2;
      var centery = rect.height/2;

      var svg = d3.select("svg"),
        width = rect.width,
        height = rect.height;

      let vennHeight = rect.height*0.9;
      let vennWidth = rect.height*0.9;

      self.game.setsArray.forEach(function(set) {
        set.subsets.forEach(function(subset) {
          if (subset.name == 'a') {
            subset.x = centerx;
            subset.y = centery - (vennHeight/3);
          }
          if (subset.name == 'b') {
            subset.x = centerx - (vennWidth/3);
            subset.y = centery + (vennHeight/3);
          }
          if (subset.name == 'c') {
            subset.x = centerx + (vennWidth/3);
            subset.y = centery + (vennHeight/3);
          }
          if (subset.name == 'ab') {
            subset.x = centerx - (vennWidth*(1/6));
            subset.y = centery - (vennHeight*(1/6));
          }
          if (subset.name == 'ac') {
            subset.x = centerx + (vennWidth*(1/6));
            subset.y = centery - (vennHeight*(1/6));
          }
          if (subset.name == 'bc') {
            subset.x = centerx;
            subset.y = centery + (vennHeight*(1/6));
          }
          if (subset.name == 'abc') {
            subset.x = centerx;
            subset.y = centery;
          }
        })
      })

      const createDefaultCircle = function(index) {
        var circle = {x: null, y: null, r: 20};
        if (index == 0) {
          circle.x = centerx;
          circle.y = centery - (vennHeight/3);
        }
        if (index == 1) {
          circle.x = centerx - (vennWidth/3);
          circle.y = centery + (vennHeight/3);
        }
        if (index == 2) {
          circle.x = centerx + (vennWidth/3);
          circle.y = centery + (vennHeight/3);
        }
        return circle;
      }

      var color = {
        "a": "#F43545",
        "b": "#FAD717",
        "c": "#00418D",
        "ab": "#FF8901",
        "ac": "#5F2879",
        "bc": "#00BA71",
        "abc": "#000000"
      }

      let groups = ["A", "B", "C"]

      const nodes = [];
      let preparedSubsets = [];
      self.game.setsArray.forEach(function(set) {
        set.subsets.forEach(function(subset) {

            if (!preparedSubsets.includes(subset.name)) {
              for (let i = 0; i < subset.value; i++) {
                nodes.push({
                  color: subset.name,
                  A: subset.inSets.includes('A'),
                  B: subset.inSets.includes('B'),
                  C: subset.inSets.includes('C'),
                  axisx: subset.x,
                  axisy: subset.y
                });
              }
              preparedSubsets.push(subset.name);
            }
          });
      })

      var simulation = d3.forceSimulation()
        .force("collision", d3.forceCollide(9).iterations(1))
        .force("x", d3.forceX(a => a.axisx).strength(0.07))
        .force("y", d3.forceY(a => a.axisy).strength(0.07))
        //.force("center", d3.forceCenter(width / 2, height / 2))
        .alphaDecay(0.001)
        .alpha(0.5)
        .nodes(nodes)
        .on("tick", ticked)
        .stop()

      simulation.tick()

      var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 6)
        .style("stroke", "black")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .style("fill", d => color[d.color])

      setTimeout(() => { simulation.restart() }, 0);

      let points = groups.map(p => nodes
        .filter(d => d[p])
        .map(d => ({ x: d.x, y: d.y, r: 15 })))

      let circles = points.map(p => d3.packEnclose(p))

      circles.forEach(function(circle, index) {
        if (!circle) {
          circles[index] = createDefaultCircle(index);
        }
      })

      const annotations = [{
        note: {
          label: "A",
        },
        dy: 0,
        dx: 0,
        x: circles[0].x,
        y: circles[0].y,
        type: d3.annotationCalloutCircle,
        className: "embedded",
        subject: {
          radius: circles[0].r,
          radiusPadding: 0
        }
      },
        {
          note: {
            label: "B",
          },
          dy: 1,
          dx: -1,
          x: circles[1].x,
          y: circles[1].y,
          className: "dedicated",
          type: d3.annotationCalloutCircle,
          subject: {
            radius: circles[1].r,
            radiusPadding: 0
          }
        },
        {
          note: {
            label: "C",
          },
          dy: 1,
          dx: 1,
          x: circles[2].x,
          y: circles[2].y,
          type: d3.annotationCalloutCircle,
          className: "embedded",
          subject: {
            radius: circles[2].r,
            radiusPadding: 0
          }
        },
      ]

      const makeAnnotations = d3.annotation()
        .annotations(annotations)
        .accessors({ x: d => d.x, y: d => d.y, title: d => d.id })

      svg.insert("g", "g", "g")
        .attr("class", "annotation-test")
        .call(makeAnnotations)

      function ticked() {
        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);

        makeAnnotations.annotations()
          .forEach((d, i) => {
            let points = nodes
              .filter(d => d[groups[i]])
              .map(d => ({ x: d.x, y: d.y, r: 20 }));
            var circle = d3.packEnclose(points);
            if (!circle) { circle = createDefaultCircle(i); };
            d.position = { x: circle.x, y: circle.y };
            d.subject.radius = circle.r -10;
            d.dx = circle.r*(d.dx<0?-1:1);
            d.dy = circle.r*(d.dy<0?-1:1)*0;
          })

        makeAnnotations.update()
      }
    }

    createExpressionElements(elements, operators) {
      var self = this;
      var result = [];

      elements.forEach(function(item, index) {
        result.push(e(StringElement, { key: 'element_' + index.toString(), value: item }))

        if (operators[index]) {
          result.push(e(StringElement, { key: 'operator_' + index.toString(), value: operators[index] }));
        }
      })

      result.push(e(StringElement, { key: 'equals', value: '=' }));
      result.push(e(StringElement, { key: '?', value: '?' }));

      return result;
    }

    render() {
      var self = this;

      return e(
        'div',
        { className: 'game venn-diagram' },
        e(
          Task,
          { task: e('div', {className: 'venn-diagram-container'},
              e('svg', {className: 'graph'}),
              e('div', {className: 'example'},
                e(Expression, { elements: this.createExpressionElements(this.game.example.operands, this.game.example.operators)}))
              )
            }
          ),
        e(
          ResultSet,{
            items: self.game.resultSet.values.map(
              function(item, index) {
                return e(StringElement, { key: 'resultSetItem_' + index.toString(), value: item})
              }
            ),
            answerIx: self.game.resultSet.answerIx,
            ref: self.resultSetComponent
          }
        )
      );
    }

  }

  return {
    VennDiagram: VennDiagram
  }

})


