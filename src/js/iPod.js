import _ from 'lodash';
import BaseElement from './BaseElement';
import Playlist from './Playlist';
import Utils from './Utils';
import Playview from './Playview';
import ipodStyle from '../css/ipod.css';
import pixelImg from '../img/pixel.gif';

const RATIO = 0.65441;
const SCREEN_BORDER_RATIO = 0.01348;
const SCREEN_FONTSIZE_RATIO = 0.060674;

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

  static get PLAYBACK_STATES () {
    return {
      STOPPED: 0,
      PLAYING: 1,
      PAUSED: 2
    };
  }

  constructor (settings) {
    super(settings);

    settings = _.merge({
      playlists: [],
      skipOnError: true,
      timeBeforeSkip: 5000,
      width: 445
    }, settings);

    this._playlists = new Set();
    this._playbackState = null;
    this._currentPlaylist = null;
    this._currentScreen = null;
    this._width = settings.height ? null : settings.width;
    this._height = settings.height;
    this._playview = new Playview({
      onEnded: this._onPlayEnd.bind(this),
      onError: this._onPlaybackError.bind(this)
    });

    this._timeoutRef = null;
    this._skipOnError = settings.skipOnError;
    this._timeBeforeSkip = settings.timeBeforeSkip;
    this.setPlaylists(settings.playlists);
    this._setPlaybackState(iPod.PLAYBACK_STATES.STOPPED);
  }

  _onPlaybackError (error, track) {
    if (this._skipOnError && error) {
      this._timeoutRef = setTimeout(() => {
        window.clearTimeout(this._timeoutRef);
        this._onPlayEnd(track);
      }, this._timeBeforeSkip);
    }
  }

  _setPlaybackState (state) {
    this._playbackState = state;

    if (this._html) {
      this._html.classList.remove(ipodStyle['playing']);
      this._html.classList.remove(ipodStyle['paused']);

      switch (state) {
        case iPod.PLAYBACK_STATES.PLAYING:
          this._html.classList.add(ipodStyle['playing']);
          break;
        case iPod.PLAYBACK_STATES.PAUSED:
          this._html.classList.add(ipodStyle['paused']);
          break;
      }
    }
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

  _applySize (width, height) {
    if (this._html) {
      const screen = this._getFromDOM('screen');

      this._html.style.width = `${width}px`;
      this._html.style.height = `${height}px`;
      screen.style.borderWidth = `${width * SCREEN_BORDER_RATIO}px`;
      screen.style.fontSize = `${width * SCREEN_FONTSIZE_RATIO}px`;
    }

    return this;
  }

  isPlaying () {
    return this._playbackState === iPod.PLAYBACK_STATES.PLAYING;
  }

  setWidth (width) {
    const height = width / RATIO;

    this._width = width;
    this._height = null;

    return this._applySize(width, height);
  }

  setHeight (height) {
    const width = height * RATIO;

    this._width = null;
    this._height = height;

    return this._applySize(width, height);
  }

  getSize() {
    const width = this._width;
    const height = this._height;

    if (width) {
      return { width, height: width / RATIO };
    } else {
      return { widht: height * RATIO, height };
    }
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
    this._setTrack(track, true);
    this._gotoScreen(iPod.SCREENS.NOW_PLAYING);
  }

  _setTrack (track, play) {
    window.clearTimeout(this._timeoutRef);
    this._playview.setTrack(track);

    if (play) {
      this._play();
    }
  }

  _play () {
    this._setPlaybackState(iPod.PLAYBACK_STATES.PLAYING);
    this._playview.play();
  }

  _pause () {
    window.clearTimeout(this._timeoutRef);
    this._setPlaybackState(iPod.PLAYBACK_STATES.PAUSED);
    this._playview.pause();
  }

  playPause () {
    if (this._playview.getTrack()) {
      if (this._playbackState === iPod.PLAYBACK_STATES.PAUSED) {
        this._play();
      } else {
        this._pause();
      }
    }
  }

  _moveOnPlaylist (movement) {
    const currentTrack = this._playview.getTrack();

    if (currentTrack) {
      const newTrack = currentTrack.getParentPlaylist().getTrack(currentTrack.getInfo().index + movement);

      if (!newTrack) {
        this._setPlaybackState(iPod.PLAYBACK_STATES.STOPPED);
        // TODO: Only move to playlist screen when the current screen is Now Playing
        this._gotoScreen(iPod.SCREENS.PLAYLIST);
      }

      this._setTrack(newTrack, this._playbackState === iPod.PLAYBACK_STATES.PLAYING);
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
        handler: this.playPause.bind(this)
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
      
      if (this._width) {
        this.setWidth(this._width);
      } else {
        this.setHeight(this._height);
      }

      this._addEventListeners();
    }

    return this;
  }
}
