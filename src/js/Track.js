import _ from 'lodash';
import BaseElement from './BaseElement';
import ListItem from './ListItem';

export default class Track extends ListItem {
  constructor (settings) {
    super(settings);

    settings = _.merge({
      artist: '[unknown artist]',
      title: '[untitled]',
      album: '[unknown album]',
      artwork: null,
      rating: 0
    }, settings);

    this._artist = settings.artist;
    this._title = settings.title;
    this._album = settings.album;
    this._artwork = settings.artwork;
    this._rating = settings.rating;
  }

  getInfo () {
    return {
      artist: this._artist,
      title: this._title,
      album: this._album,
      artwork: this._artwork,
      rating: this._rating
    };
  }

  _createHTML () {
    if (!this._html) {
      super._createHTML();
      this._addToDOM(BaseElement.createText(this._artist), 'title');
      this._addToDOM(BaseElement.createText(this._title), 'subtitle');
    }
  }
}
