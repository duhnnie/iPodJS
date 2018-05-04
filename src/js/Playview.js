import _ from 'lodash';
import BaseElement from './BaseElement';
import playviewStyles from '../css/playview.css';

export default class Playview extends BaseElement {
  constructor (settings) {
    super(settings);

    settings = _.merge({
      artist: '[unknown artist]',
      title: '[unknown]',
      album: '[unknown album]',
      artwork: null,
      rating: 0,
      index: null
    }, settings);

    this.setInfo(settings);
  }

  setInfo (info) {
    this._artist = info.artist;
    this._title = info.title;
    this._album = info.album;
    this._artwork = info.artwork;
    this._rating = info.rating;
    this._index = info.index;

    if (this._html) {
      let ratingText = '';

      for (let i = 0; i < info.rating; i++) {
        ratingText += '★';
      }

      this._setToDOM(BaseElement.createText(info.artist), 'artist');
      this._setToDOM(BaseElement.createText(info.title), 'title');
      this._getFromDOM('artwork').style.backgroundImage = `url(${info.artwork})`;
      this._setToDOM(BaseElement.createText(info.album), 'album');
      this._setToDOM(BaseElement.createText(ratingText), 'rating');
      this._setToDOM(BaseElement.createText(info.index), 'index');

      this._setToDOM(BaseElement.createText('00:00'), 'elapsedTime');
      this._setToDOM(BaseElement.createText('00:00'), 'remainingTime');
    }
  }

  _createHTML () {
    if (!this._html) {
      super._createHTML();

      this._addToDOM(BaseElement.create('div', playviewStyles['container']), null, 'trackInfoContainer');
      this._addToDOM(BaseElement.create('img', playviewStyles['artwork']), 'trackInfoContainer', 'artwork');
      this._addToDOM(BaseElement.create('div', playviewStyles['track-titles']), 'trackInfoContainer', 'trackTitles');
      this._addToDOM(BaseElement.create('ul', playviewStyles['track-titles-list']), 'trackTitles', 'trackTitlesList');
      this._addToDOM(BaseElement.create('li', playviewStyles['track-titles-list-item-big']), 'trackTitlesList', 'title');
      this._addToDOM(BaseElement.create('li', playviewStyles['track-titles-list-item-small']), 'trackTitlesList', 'artist');
      this._addToDOM(BaseElement.create('li', playviewStyles['track-titles-list-item-small']), 'trackTitlesList', 'album');
      this._addToDOM(BaseElement.create('li', playviewStyles['track-titles-list-item']), 'trackTitlesList', 'rating');
      this._addToDOM(BaseElement.create('li', playviewStyles['track-titles-list-item-index']), 'trackTitlesList', 'index');

      this._getFromDOM('artwork').setAttribute('img', './img/pixel.gif');

      this._addToDOM(BaseElement.create('div', playviewStyles['timebox']), null, 'timebox');
      this._addToDOM(BaseElement.create('span'), 'timebox', 'elapsedTime');
      this._addToDOM(BaseElement.create('div', playviewStyles['progress-container']), 'timebox', 'progressBarContainer');
      this._addToDOM(BaseElement.create('div', playviewStyles['progress-bar']), 'progressBarContainer', 'progressBar');
      this._addToDOM(BaseElement.create('span'), 'timebox', 'remainingTime');

      this.setInfo({
        artist: this._artist,
        title: this._title,
        album: this._album,
        artwork: this._artwork,
        rating: this._rating,
        index: this._index
      });
    }
  }
}
