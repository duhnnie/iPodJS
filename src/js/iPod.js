import _ from 'lodash';
import BaseElement from './BaseElement';
import Playlist from './Playlist';
import Utils from './Utils';
import ipodStyle from '../css/ipod.css';
import PlayView from './PlayView';

export class iPod extends BaseElement {
  constructor (settings) {
    super(settings);

    settings = _.merge({
      playlists: []
    }, settings);

    this._playlists = new Set();
    this._playView = new PlayView();

    this.setPlaylists(settings.playlists);
  }

  clearPlaylists () {
    this._playlists.clear();
  }

  _setTracklist (playlist) {
    const tracks = playlist.getTracks();

    tracks.forEach((track) => {
      this._addToDOM(track.getHTML(), 'tracklistPanel');
    });
  }

  _onSelectPlaylist (playlist) {
    this._setTracklist(playlist);

    Utils.animate(this._getFromDOM('container'), 'left', '-100%');
  }

  _onSelectTrackHandler (track) {
    const trackInfo = track.getInfo();

    trackInfo.index = `${trackInfo.index + 1} of ${track.getParentPlaylist().getTracks().length}`;

    this._playView.setInfo(trackInfo);

    Utils.animate(this._getFromDOM('container'), 'left', '-200%');
  }

  addPlaylist (playlist) {
    if (typeof playlist !== 'object') {
      throw new Error('addPlaylist(): The parameter must be an object or an instance of Playlist.');
    } else if (!(playlist instanceof Playlist)) {
      playlist = new Playlist(playlist);
    }

    playlist.setOnClick(this._onSelectPlaylist.bind(this));
    playlist.setOnSelectTrack(this._onSelectTrackHandler.bind(this));

    this._playlists.add(playlist);

    if (this._html) {
      this._addToDOM(playlist.getHTML(), 'playlistPanel');
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
      const topBar = BaseElement.create('div');
      const container = BaseElement.create('div');
      const playlistPanel = BaseElement.create('ul');
      const tracklistPanel = BaseElement.create('ul');
      const playingPanel = BaseElement.create('div');

      super._createHTML();

      screen.classList.add(ipodStyle['screen']);
      topBar.classList.add(ipodStyle['top-bar']);
      container.classList.add(ipodStyle['container']);
      playlistPanel.classList.add(ipodStyle['panel'], ipodStyle['list']);
      tracklistPanel.classList.add(ipodStyle['panel'], ipodStyle['list']);
      playingPanel.classList.add(ipodStyle['panel']);

      this._addToDOM(screen, null, 'screen');
      this._addToDOM(topBar, 'screen', 'topBar');
      this._addToDOM(container, 'screen', 'container');
      this._addToDOM(playlistPanel, 'container', 'playlistPanel');
      this._addToDOM(tracklistPanel, 'container', 'tracklistPanel');
      this._addToDOM(playingPanel, 'container', 'playingPanel');
      this._addToDOM(this._playView.getHTML(), 'playingPanel');

      this.setPlaylists([...this._playlists]);
    }

    return this;
  }
}
