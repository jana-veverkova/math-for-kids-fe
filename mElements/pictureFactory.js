define(function (require) {

  const e = React.createElement;

  function PictureFactory() {
    this.classLists = [];
    this.classLists.push('tree');
    this.classLists.push('cherry');
    this.classLists.push('bear');

    this.pictureKey = 0;

    shuffleArray(this.classLists);

    function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
  }

  PictureFactory.prototype.createPicture = function(imageIndex) {
    var self = this;
    self.pictureKey = self.pictureKey + 1;
    return e(Picture, { key: 'picture_' + self.pictureKey, cssClass: self.classLists[parseInt(imageIndex)-1]});
  }

  class Picture extends React.Component {
    constructor(props) {
      super(props);
      this.cssClass = this.props.cssClass;
    }

    render() {
      return e(
        'div',
        { className: `element picture ${this.cssClass}` }
      );
    }
  }

  return {
    PictureFactory: PictureFactory
  }

})

