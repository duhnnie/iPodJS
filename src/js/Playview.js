import _ from 'lodash';
import BaseElement from './BaseElement';

export default class Playview extends BaseElement {
  constructor (settings) {
    super(settings);

    settings = _.merge({
      artist: '[unknown artist]',
      title: '[unknown]',
      album: '[unknown album]',
      cover: null,
      rating: 0,
      index: null
    }, settings);

    this.setInfo(settings);
  }

  setInfo (info) {
    this._artist = info.artist;
    this._title = info.title;
    this._album = info.album;
    this._cover = info.cover;
    this._rating = info.rating;
    this._index = info.index;

    if (this._html) {
      this._addToDOM(BaseElement.createText(info.artist), this._getFromDOM('artist'));
      this._addToDOM(BaseElement.createText(info.title), this._getFromDOM('title'));
      this._getFromDOM('album').setAttribute('src', info.album);
      this._addToDOM(BaseElement.createText(info.cover), this._getFromDOM('cover'));
      this._addToDOM(BaseElement.createText(info.rating), this._getFromDOM('rating'));
      this._addToDOM(BaseElement.createText(info.index), this._getFromDOM('index'));
    }
  }

  _createHTML () {
    if (!this._html) {
      super._createHTML();

      this._addToDOM(BaseElement.create('div'), null, 'trackInfoContainer');
      this._addToDOM(BaseElement.create('img'), 'trackInfoContainer', 'cover');
      this._addToDOM(BaseElement.create('div'), 'trackInfoContainer', 'trackTitles');
      this._addToDOM(BaseElement.create('ul'), 'trackTitles', 'trackTitlesList');
      this._addToDOM(BaseElement.create('li'), 'trackTitlesList', 'title');
      this._addToDOM(BaseElement.create('li'), 'trackTitlesList', 'artist');
      this._addToDOM(BaseElement.create('li'), 'trackTitlesList', 'album');
      this._addToDOM(BaseElement.create('li'), 'trackTitlesList', 'rating');
      this._addToDOM(BaseElement.create('li'), 'trackTitlesList', 'index');

      this._addToDOM(BaseElement.create('div'), null, 'timebox');
      this._addToDOM(BaseElement.create('span'), 'timebox', 'elapsedTime');
      this._addToDOM(BaseElement.create('span'), 'timebox', 'remainingTime');
      this._addToDOM(BaseElement.create('div'), 'timebox', 'progressBarContainer');
      this._addToDOM(BaseElement.create('progress'), 'progressBarContainer', 'progressBar');

      this.setInfo({
        artist: this._artist,
        title: this._title,
        album: this._album,
        cover: this._cover,
        rating: this._rating,
        index: this._index
      });
    }
  }
}
