import _ from 'lodash';
import BaseElement from './BaseElement';
import Playlist from './Playlist';
import Utils from './Utils';
import Playview from './Playview';
import ipodStyle from '../css/ipod.css';
import pixelImg from '../img/pixel.gif';

export class iPod extends BaseElement {
  static get SCREENS () {
    return {
      HOME: {
        left: '0%',
        text: 'Playlists'
      },
      PLAYLIST: {
        left: '-100%',
        text: (instance) => instance._currentPlaylist.getName(),
        parent: 'HOME'
      },
      NOW_PLAYING: {
        left: '-200%',
        text: 'Now Playing',
        parent: 'PLAYLIST'
      }
    };
  }

  constructor (settings) {
    super(settings);

    settings = _.merge({
      playlists: [],
      skipTrackOnError: true,
      timeBeforeSkip: 10000
    }, settings);

    this._playlists = new Set();
    this._currentPlaylist = null;
    this._currentScreen = null;
    this._playview = new Playview({
      onEnded: this._onPlayEnd.bind(this),
      skipOnError: settings.skipTrackOnError,
      timeBeforeSkip: settings.timeBeforeSkip
    });

    this.setPlaylists(settings.playlists);
  }

  _gotoScreen (screen) {
    const container = this._getFromDOM('container');

    Utils.animate(container, 'left', `${screen.left}`, () => {
      this._currentScreen = screen;
      this._getFromDOM('topBarText').data = (typeof screen.text === 'function' ? screen.text(this) : screen.text);
    });
  }

  _onPlayEnd (track) {
    this.next();
  }

  back () {
    const parentScreen = this._currentScreen.parent;

    if (parentScreen) {
      this._gotoScreen(iPod.SCREENS[parentScreen]);
    }
  }

  clearPlaylists () {
    this._playlists.clear();
  }

  _setTracklist (playlist) {
    const tracks = playlist.getTracks();

    this._currentPlaylist = playlist;
    this._clear('tracklistPanel');

    tracks.forEach((track) => {
      this._addToDOM(track.getHTML(), 'tracklistPanel');
    });
  }

  _onSelectPlaylist (playlist) {
    this._setTracklist(playlist);

    this._gotoScreen(iPod.SCREENS.PLAYLIST);
  }

  _onSelectTrackHandler (track) {
    this.play(track);
  }

  _setTrack (track) {
    this._playview.setTrack(track);
  }

  play (track) {
    if (track) {
      this._setTrack(track);

      if (!this._playview.isPlaying()) {
        this._playview.playPause();
      }

      this._gotoScreen(iPod.SCREENS.NOW_PLAYING);
    } else {
      this._playview.playPause();
    }
  }

  _moveOnPlaylist (movement) {
    const currentTrack = this._playview.getTrack();

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
      const screen = BaseElement.create('div', ipodStyle['screen']);
      const topBar = BaseElement.create('div', ipodStyle['top-bar']);
      const container = BaseElement.create('div', ipodStyle['container']);
      const playlistPanel = BaseElement.create('ul', [ipodStyle['panel'], ipodStyle['list']]);
      const tracklistPanel = BaseElement.create('ul', [ipodStyle['panel'], ipodStyle['list']]);
      const playingPanel = BaseElement.create('div', ipodStyle['panel']);

      super._createHTML();

      this._getControlsHTMLDef().forEach((def) => {
        const img = BaseElement.create('img');
        const link = BaseElement.create('a', ipodStyle[def.ref]);

        // TODO: use images as module
        img.src = pixelImg;
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
      this._addToDOM(BaseElement.createText(''), 'topBar', 'topBarText');
      this._addToDOM(this._playview.getHTML(), 'playingPanel');

      this.setPlaylists([...this._playlists]);
      this._gotoScreen(iPod.SCREENS.HOME);

      this._addEventListeners();
    }

    return this;
  }
}
