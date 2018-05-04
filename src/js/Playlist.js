import _ from 'lodash';
import BaseElement from './BaseElement';
import ListItem from './ListItem';
import Track from './Track';

export default class Playlist extends ListItem {
  constructor (settings) {
    super(settings);

    settings = _.merge({
      name: '[untitled playlist]',
      tracks: [],
      onSelectTrack: null
    }, settings);

    this._name = settings.name;
    this._tracks = new Set();

    this.setTracks(settings.tracks);
    this.setOnSelectTrack(settings.onSelectTrack);
  }

  setOnSelectTrack (callback) {
    if (callback === null || typeof callback === 'function') {
      this._onSelectTrack = callback;
    }
  }

  clearTracks () {
    this._tracks.clear();
  }

  _onSelectTrackHandler (track) {
    return this._onSelectTrack && this._onSelectTrack(track);
  }

  addTrack (track) {
    if (typeof track !== 'object') {
      throw new Error('addTrack(): The parameter must be an object or an instance of Track');
    } else if (!(track instanceof Track)) {
      track = new Track(track);
    }

    track.setOnClick(this._onSelectTrackHandler.bind(this));

    this._tracks.add(track);
  }

  setTracks (tracks) {
    if (!_.isArray(tracks)) {
      throw new Error('setTracks(): The parameter must be an array.');
    }

    this.clearTracks();

    tracks.forEach(this.addTrack.bind(this));
  }

  getTracks () {
    return [...this._tracks];
  }

  _createHTML () {
    if (!this._html) {
      super._createHTML();

      this._addToDOM(BaseElement.createText(this._name), 'title');
      this._addToDOM(BaseElement.createText(`${this._tracks.size} Songs`), 'subtitle');

      this._addEventListeners();
    }
  }
}
