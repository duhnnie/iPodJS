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

  back () {
    const container = this._getFromDOM('container');
    const left = parseInt(container.style.left, 10);

    if (left < 0) {
      Utils.animate(container, 'left', `${left + 100}%`);
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
      this._playView.setTrack(track);

      if (!this._playView.isPlaying()) {
        this._playView.play();
      }

      Utils.animate(this._getFromDOM('container'), 'left', '-200%');
    } else {
      if (this._playView.isPlaying()) {
        this._playView.stop();
      } else {
        this._playView.play();
      }
    }
  }

  _moveOnPlaylist (movement) {
    const currentTrack = this._playView.getTrack();

    if (currentTrack) {
      const newTrack = currentTrack.getParentPlaylist().getTrack(currentTrack.getInfo().index + movement);

      if (!newTrack && this._playView.isPlaying()) {
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
      this._getFromDOM('menuArea').addEventListener('click', () => this.back());
      this._getFromDOM('prevArea').addEventListener('click', () => this.prev());
      this._getFromDOM('nextArea').addEventListener('click', () => this.next());
      this._getFromDOM('playArea').addEventListener('click', () => this.play());
      this._getFromDOM('selectArea').addEventListener('click', () => console.log('selection'));
    }
  }

  _createHTML () {
    if (!this._html) {
      const screen = BaseElement.create('div');
      const topBar = BaseElement.create('div');
      const container = BaseElement.create('div');
      const playlistPanel = BaseElement.create('ul');
      const tracklistPanel = BaseElement.create('ul');
      const playingPanel = BaseElement.create('div');
      const controlsImg = BaseElement.create('img');
      const map = BaseElement.create('map');
      const menuArea = BaseElement.create('area');
      const prevArea = BaseElement.create('area');
      const nextArea = BaseElement.create('area');
      const playArea = BaseElement.create('area');
      const selectArea = BaseElement.create('area');
      const mapName = 'ipodjs-map';

      super._createHTML();

      screen.classList.add(ipodStyle['screen']);
      topBar.classList.add(ipodStyle['top-bar']);
      container.classList.add(ipodStyle['container']);
      playlistPanel.classList.add(ipodStyle['panel'], ipodStyle['list']);
      tracklistPanel.classList.add(ipodStyle['panel'], ipodStyle['list']);
      playingPanel.classList.add(ipodStyle['panel']);
      controlsImg.classList.add(ipodStyle['controls-image']);
      controlsImg.src = './img/pixel.gif';
      controlsImg.useMap = mapName;
      map.name = mapName;
      menuArea.shape = 'rect';
      menuArea.href = '#';
      menuArea.coords = '150,30,290,85';
      prevArea.shape = 'circle';
      prevArea.href = '#';
      prevArea.coords = '125,130,40';
      nextArea.shape = 'circle';
      nextArea.href = '#';
      nextArea.coords = '312,145,40';
      playArea.shape = 'circle';
      playArea.href = '#';
      playArea.coords = '212,230,45';
      selectArea.shape = 'circle';
      selectArea.href = '#';
      selectArea.coords = '215,135,47';

      this._addToDOM(screen, null, 'screen');
      this._addToDOM(controlsImg);
      this._addToDOM(topBar, 'screen', 'topBar');
      this._addToDOM(container, 'screen', 'container');
      this._addToDOM(playlistPanel, 'container', 'playlistPanel');
      this._addToDOM(tracklistPanel, 'container', 'tracklistPanel');
      this._addToDOM(playingPanel, 'container', 'playingPanel');
      this._addToDOM(this._playView.getHTML(), 'playingPanel');
      this._addToDOM(map, null, 'map');
      this._addToDOM(menuArea, 'map', 'menuArea');
      this._addToDOM(prevArea, 'map', 'prevArea');
      this._addToDOM(nextArea, 'map', 'nextArea');
      this._addToDOM(playArea, 'map', 'playArea');
      this._addToDOM(selectArea, 'map', 'selectArea');

      this.setPlaylists([...this._playlists]);

      this._addEventListeners();
    }

    return this;
  }
}
