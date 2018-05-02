import _ from 'lodash';
import BaseElement from './BaseElement';

export default class Playlist extends BaseElement {
  constuctor (settings) {
    super(settings);

    settings = _.merge({
      tracks: []
    }, settings);

    this._tracks = new Set();

    this.setTracks(settings.tracks);
  }

  clearTracks () {

  }

  addTrack (track) {
  }

  setTracks (tracks) {
    if (!_.isArray(tracks)) {
      throw new Error('setTracks(): The parameter must be an array.');
    }

    this.clearTracks();

    tracks.forEach(this.addTrack.bind(this));
  }
}
