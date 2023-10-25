define(function (require) {

  const e = React.createElement;

  let Helper = require("shared/helper").Helper;

  function MotiveFactory() {

    this.helper = new Helper();
    this.pictures = ['snowman', 'penguin', 'snowflake', 'boat', 'duck', 'cherry', 'tree', 'mushroom', 'truck', 'train', 'bear', 'airballoon', 'butterfly',
    'snowyTree', 'winterBear', 'octopus', 'turtle', 'whale', 'kite', 'plane'];

    let backgrounds = {
      winter: {
        background: 'winter-background',
        backgroundMotive: 'iglu'
      },
      sea: {
        background: 'sea-background',
        backgroundMotive: 'lighthouse'
      },
      meadow: {
        background: 'meadow-background',
        backgroundMotive: 'flowers'
      },
      sky: {
        background: 'sky-background',
        backgroundMotive: 'cloud'
      }
    };

    this.pictureBackground = {
      'snowman': backgrounds.winter,
      'penguin': backgrounds.winter,
      'snowflake': backgrounds.winter,
      'snowyTree': backgrounds.winter,
      'winterBear': backgrounds.winter,
      'boat': backgrounds.sea,
      'duck': backgrounds.sea,
      'octopus': backgrounds.sea,
      'turtle': backgrounds.sea,
      'whale': backgrounds.sea,
      'cherry': backgrounds.meadow,
      'tree': backgrounds.meadow,
      'mushroom': backgrounds.meadow,
      'truck': backgrounds.meadow,
      'train': backgrounds.meadow,
      'bear': backgrounds.meadow,
      'airballoon': backgrounds.sky,
      'butterfly': backgrounds.sky,
      'kite': backgrounds.sky,
      'plane': backgrounds.sky
    }
  }

  MotiveFactory.prototype.getRandomMotive = function() {
    var self = this;

    self.helper.shuffleArray(self.pictures);

    let picture = self.pictures[0];
    let background = self.pictureBackground[picture];

    let motive = new Motive(
      {
        background: background.background,
        backgroundMotive: background.backgroundMotive,
        pictures: [picture]
      });

    Object.keys(self.pictureBackground).forEach(function (key) {
      if (picture != key) {
        if (self.pictureBackground[key] == background) {
          motive.pictures.push(key);
        }
      }
    })

    return motive;
  }

  function Motive(props) {
    this.background = props.background;
    this.backgroundMotive = props.backgroundMotive;
    this.pictures = props.pictures;

    this.laskPictureKey = 0;
  }

  Motive.prototype.getBackgroundClass = function() {
    return this.background;
  }

  Motive.prototype.getBackgroundMotiveClass = function() {
    return this.backgroundMotive;
  }

  Motive.prototype.createPicture = function(imageIx, keyIx) {
    var self = this;
    self.lastPictureKey = self.lastPictureKey + 1;
    return e(Picture,
      {
        key: 'picture_' + keyIx ? keyIx : self.lastPictureKey,
        cssClass: self.pictures[parseInt(imageIx)-1]
      }
      );
  }

  class Picture extends React.Component {
    constructor(props) {
      super(props);
      this.cssClass = this.props.cssClass;
      this.hint = this.props.hint;

      this.state = { withHint: false }
    }

    render() {
      return e(
        'div',
        { className: `element picture ${this.cssClass}` }
      );
    }
  }

  return {
    MotiveFactory: MotiveFactory
  }

})

