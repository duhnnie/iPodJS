import _ from 'lodash';
import BaseElement from './BaseElement';
import Utils from './Utils';
import playviewStyles from '../css/playview.css';

export default class Playview extends BaseElement {
  constructor (settings) {
    super(settings);

    settings = _.merge({
      onEnded: null,
      track: null,
      skipOnError: true,
      timeBeforeSkip: 10000
    }, settings);

    this._audio = new window.Audio();
    this._onEnded = settings.onEnded;
    this._isPlaying = false;
    this._timeoutRef = null;
    this._skipOnError = settings.skipOnError;
    this._timeBeforeSkip = settings.timeBeforeSkip;

    this.setTrack(settings.track);
  }

  _showTrackNotification (text) {
    this._getFromDOM('trackNotification').data = text;
  }

  play () {
    if (this._track) {
      const audioSource = this._track.getAudio() || '';

      this._audio.setAttribute('src', audioSource || '');
      this._isPlaying = true;

      if (audioSource) {
        this._audio.play();
      }
    }
  }

  stop () {
    this._isPlaying = false;
    this._audio.pause();
  }

  setTrack (track) {
    let info;

    this._track = track;

    if (track) {
      info = track.getInfo();
      info.index = `${info.index + 1} of ${track.getParentPlaylist().getTracks().length}`;

      if (this._isPlaying) {
        this.stop();
        this.play();
      }
    } else {
      info = {};
      this.stop();
    }

    if (this._html) {
      let ratingText = '';

      for (let i = 0; i < info.rating; i++) {
        ratingText += '★';
      }

      this._setToDOM(BaseElement.createText(info.artist), 'artist');
      this._setToDOM(BaseElement.createText(info.title), 'title');
      this._getFromDOM('artwork').style.backgroundImage = `url(${info.artwork || ''})`;
      this._setToDOM(BaseElement.createText(info.album), 'album');
      this._setToDOM(BaseElement.createText(ratingText), 'rating');
      this._setToDOM(BaseElement.createText(info.index), 'index');

      this._showTrackNotification(!info.audio ? '[not available]' : '');
      this._updatePlaybackTime(0, 0);
    }

    return this;
  }

  isPlaying () {
    return this._isPlaying;
  }

  getTrack () {
    return this._track;
  }

  _updatePlaybackTime (duration, currentTime) {
    const elapsedSeconds = Math.round(currentTime);
    const remainingSeconds = Math.round(duration - elapsedSeconds);

    this._setToDOM(BaseElement.createText(`${Utils.secondsToTime(elapsedSeconds)}`), 'elapsedTime');
    this._getFromDOM('progressBar').style.width = `${currentTime / duration * 100 || 0}%`;
    this._setToDOM(BaseElement.createText(`-${Utils.secondsToTime(remainingSeconds || 0)}`), 'remainingTime');
  }

  _onEndedHandler () {
    return this._onEnded && this._onEnded(this._track);
  }

  _addEventListeners () {
    this._audio.addEventListener('timeupdate', (e) => {
      if (this._track) {
        this._updatePlaybackTime(e.target.duration, e.target.currentTime);
      }
    });

    this._audio.addEventListener('ended', this._onEndedHandler.bind(this));
    this._audio.addEventListener('loadstart', () => this._showTrackNotification('loading...'));
    this._audio.addEventListener('loadeddata', () => this._showTrackNotification(''));
    this._audio.addEventListener('error', () => {
      this._showTrackNotification('[not available]');
      
      if (this._skipOnError) {
        this._timeoutRef = setTimeout(() => {
          window.clearTimeout(this._timeoutRef);
          this._onEndedHandler();
        }, this._timeBeforeSkip);
      }
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
      this._addToDOM(BaseElement.createText(''), 'progressBarContainer', 'trackNotification');
      this._addToDOM(BaseElement.create('div', playviewStyles['progress-bar']), 'progressBarContainer', 'progressBar');
      this._addToDOM(BaseElement.create('span'), 'timebox', 'remainingTime');

      this.setTrack(this._track);
    }
  }
}
