import _ from 'lodash';
import BaseElement from './BaseElement';
import Playlist from './Playlist';
import Utils from './Utils';
import PlayView from './PlayView';
import ipodStyle from '../css/ipod.css';

export class iPod extends BaseElement {
  constructor (settings) {
    super(settings);

    settings = _.merge({
      playlists: [],
      skipTrackOnError: true,
      timeBeforeSkip: 10000
    }, settings);

    this._playlists = new Set();
    this._playView = new PlayView({
      onEnded: this._onPlayEnd.bind(this),
      skipOnError: settings.skipTrackOnError,
      timeBeforeSkip: settings.timeBeforeSkip
    });

    this.setPlaylists(settings.playlists);
  }

  _onPlayEnd (track) {
    this.next();
  }

  back (callback = null) {
    const container = this._getFromDOM('container');
    const left = parseInt(container.style.left, 10);

    if (left < 0) {
      Utils.animate(container, 'left', `${left + 100}%`, callback);
    }
  }

  clearPlaylists () {
    this._playlists.clear();
  }

  _setTracklist (playlist) {
    const tracks = playlist.getTracks();

    this._clear('tracklistPanel');

    tracks.forEach((track) => {
      this._addToDOM(track.getHTML(), 'tracklistPanel');
    });
  }

  _onSelectPlaylist (playlist) {
    this._setTracklist(playlist);

    Utils.animate(this._getFromDOM('container'), 'left', '-100%');
  }

  _onSelectTrackHandler (track) {
    this.play(track);
  }

  _setTrack (track) {
    this._playView.setTrack(track);
  }

  play (track) {
    if (track) {
      this._setTrack(track);

      if (!this._playView.isPlaying()) {
        this._playView.playPause();
      }

      Utils.animate(this._getFromDOM('container'), 'left', '-200%');
    } else {
      this._playView.playPause();
    }
  }

  _moveOnPlaylist (movement) {
    const currentTrack = this._playView.getTrack();

    if (currentTrack) {
      const newTrack = currentTrack.getParentPlaylist().getTrack(currentTrack.getInfo().index + movement);

      if (!newTrack) {
        this.back();
      }

      this._setTrack(newTrack);
    }
  }

  prev () {
    this._moveOnPlaylist(-1);
  }

  next () {
    this._moveOnPlaylist(1);
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

  _getRootClasses () {
    return [ipodStyle['ipodjs']];
  }

  _addEventListeners () {
    if (this._getFromDOM('screen')) {
      const that = this;

      this._getControlsHTMLDef().forEach((def) => {
        that._getFromDOM(def.ref).addEventListener('click', (e) => {
          e.preventDefault();
          def.handler();
        });
      });
    }
  }

  _getControlsHTMLDef () {
    return [
      {
        ref: 'menu-link',
        handler: this.back.bind(this)
      },
      {
        ref: 'forward-link',
        handler: this.next.bind(this)
      },
      {
        ref: 'backward-link',
        handler: this.prev.bind(this)
      },
      {
        ref: 'play-link',
        handler: this.play.bind(this)
      },
      {
        ref: 'select-link',
        handler: () => {}
      }
    ];
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

      this._getControlsHTMLDef().forEach((def) => {
        const img = BaseElement.create('img');
        const link = BaseElement.create('a', ipodStyle[def.ref]);

        // TODO: use images as module
        img.src = '/img/pixel.gif';
        link.href = '#';

        this._addToDOM(link, null, def.ref);
        this._addToDOM(img, def.ref);
      });

      this._addToDOM(screen, null, 'screen');
      this._addToDOM(topBar, 'screen', 'topBar');
      this._addToDOM(container, 'screen', 'container');
      this._addToDOM(playlistPanel, 'container', 'playlistPanel');
      this._addToDOM(tracklistPanel, 'container', 'tracklistPanel');
      this._addToDOM(playingPanel, 'container', 'playingPanel');
      this._addToDOM(this._playView.getHTML(), 'playingPanel');

      this.setPlaylists([...this._playlists]);

      this._addEventListeners();
    }

    return this;
  }
}
