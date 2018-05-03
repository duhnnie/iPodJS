import _ from 'lodash';
import BaseElement from './BaseElement';
import Track from './Track';
import playslistStyle from '../css/playlist.css';

export default class Playlist extends BaseElement {
  constructor (settings) {
    super(settings);

    settings = _.merge({
      name: '[untitled playlist]',
      tracks: []
    }, settings);

    this._name = settings.name;
    this._tracks = new Set();
    this._elementTag = 'li';

    this.setTracks(settings.tracks);
  }

  clearTracks () {
    this._tracks.clear();
  }

  addTrack (track) {
    if (typeof track !== 'object') {
      throw new Error('addTrack(): The parameter must be an object or an instance of Track');
    } else if (!(track instanceof Track)) {
      track = new Track(track);
    }

    this._tracks.add(track);
  }

  setTracks (tracks) {
    if (!_.isArray(tracks)) {
      throw new Error('setTracks(): The parameter must be an array.');
    }

    this.clearTracks();

    tracks.forEach(this.addTrack.bind(this));
  }

  _getRootClasses () {
    return [playslistStyle['playlist']];
  }

  _createHTML () {
    if (!this._html) {
      const link = BaseElement.create('a');
      const name = BaseElement.create('div');
      const count = BaseElement.create('span');

      super._createHTML();

      link.setAttribute('href', '#');
      link.classList.add(playslistStyle['link']);
      name.classList.add(playslistStyle['name']);
      count.classList.add(playslistStyle['count']);

      this._addToDOM(BaseElement.createText(this._name), name);
      this._addToDOM(BaseElement.createText(`${this._tracks.size} Songs`), count);
      this._addToDOM(link, null, 'link');
      this._addToDOM(name, 'link');
      this._addToDOM(count, 'link');
    }
  }
}
