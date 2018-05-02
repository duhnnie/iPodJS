import _ from 'lodash';
import BaseElement from './BaseElement';
import Track from './Track';

export default class Playlist extends BaseElement {
  constructor (settings) {
    super(settings);

    settings = _.merge({
      name: '[untitled playlist]',
      tracks: []
    }, settings);

    this._name = settings.name;
    this._tracks = new Set();
    this._elementTag = 'ul';

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

    if (this._html) {
      this._html.appendChild(track.getHTML());
    }
  }

  setTracks (tracks) {
    if (!_.isArray(tracks)) {
      throw new Error('setTracks(): The parameter must be an array.');
    }

    this.clearTracks();

    tracks.forEach(this.addTrack.bind(this));
  }

  _createHTML () {
    if (!this._html) {
      const title = BaseElement.create('h2');

      super._createHTML();

      title.appendChild(BaseElement.createText(this._name));
      this._html.appendChild(title);
      this.setTracks([...this._tracks]);
    }
  }
}
