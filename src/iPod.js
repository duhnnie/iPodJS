import _ from 'lodash';
import BaseElement from './BaseElement';
import Playlist from './Playlist';

export class iPod extends BaseElement {
  constructor (settings) {
    super(settings);

    settings = _.merge({
      playlists: []
    }, settings);

    this._playlists = new Set();

    this.setPlaylists(settings.playlists);
  }

  clearPlaylists () {
    this._playlists.clear();
  }

  addPlaylist (playlist) {
    if (typeof playlist !== 'object') {
      throw new Error('addPlaylist(): The parameter must be an object or an instance of Playlist.');
    } else if (!(playlist instanceof Playlist)) {
      playlist = new Playlist(playlist);
    }

    this._playlists.add(playlist);
  }

  setPlaylists (playlists) {
    if (!_.isArray(playlists)) {
      throw new Error('setPlaylist(): The parameter must be an array.');
    }

    this.clearPlaylists();

    _.forEach(playlists, this.addPlaylist.bind(this));
  }
}
