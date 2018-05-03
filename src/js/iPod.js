import _ from 'lodash';
import BaseElement from './BaseElement';
import Playlist from './Playlist';
import ipodStyle from '../css/ipod.css';

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

    if (this._html) {
      this._dom.screen.appendChild(playlist.getHTML());
    }
  }

  setPlaylists (playlists) {
    if (!_.isArray(playlists)) {
      throw new Error('setPlaylist(): The parameter must be an array.');
    }

    this.clearPlaylists();

    _.forEach(playlists, this.addPlaylist.bind(this));
  }

  _createHTML () {
    if (!this._html) {
      const screen = BaseElement.create('div');

      super._createHTML();

      screen.classList.add(ipodStyle['screen']);
      this._html.appendChild(screen);

      this._addToDOM(screen, null, 'screen');

      this.setPlaylists([...this._playlists]);
    }

    return this;
  }
}
