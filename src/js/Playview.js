import _ from 'lodash';
import BaseElement from './BaseElement';
import Utils from './Utils';
import playviewStyles from '../css/playview.css';

export default class Playview extends BaseElement {
  constructor (settings) {
    super(settings);

    settings = _.merge({
      onEnded: null
    }, settings);

    this._audio = new window.Audio();
    this._onEnded = settings.onEnded;
  }

  play (audioSource) {
    if (audioSource) {
      this._audio.setAttribute('src', audioSource);
    }

    this._audio.play();
  }

  stop () {
    this._audio.pause();
  }

  setTrack (track) {
    let info;

    this.stop();

    if (track) {
      info = track.getInfo();
      info.index = `${info.index + 1} of ${track.getParentPlaylist().getTracks().length}`;
      this.play(info.audio);
    } else {
      info = {};
    }

    this._track = track;

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

      this._updatePlaybackTime(0, 0);
    }
  }

  _updatePlaybackTime (duration, currentTime) {
    const elapsedSeconds = Math.round(currentTime);
    const remainingSeconds = Math.round(duration - elapsedSeconds);

    this._setToDOM(BaseElement.createText(`${Utils.secondsToTime(elapsedSeconds)}`), 'elapsedTime');
    this._getFromDOM('progressBar').style.width = `${currentTime / duration * 100 || 0}%`;
    this._setToDOM(BaseElement.createText(`${Utils.secondsToTime(remainingSeconds)}`), 'remainingTime');
  }

  _addEventListeners () {
    this._audio.addEventListener('timeupdate', (e) => {
      if (this._track) {
        this._updatePlaybackTime(e.target.duration, e.target.currentTime);
      }
    });

    this._audio.addEventListener('ended', () => {
      return this._onEnded && this._onEnded(this._track);
    });
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

      this.setTrack(this._track);
    }
  }
}
