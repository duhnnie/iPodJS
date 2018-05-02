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
}
