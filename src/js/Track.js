import _ from 'lodash';
import BaseElement from './BaseElement';
import ListItem from './ListItem';
import Playlist from './Playlist';

export default class Track extends ListItem {
  constructor (settings) {
    super(settings);

    settings = _.merge({
      artist: '[unknown artist]',
      title: '[untitled]',
      album: '[unknown album]',
      artwork: null,
      audio: '',
      index: null,
      rating: 0,
      parentPlaylist: null
    }, settings);

    this._artist = settings.artist;
    this._title = settings.title;
    this._album = settings.album;
    this._artwork = settings.artwork;
    this._audio = settings.audio || '';
    this._rating = settings.rating;
    this._parentPlaylist = settings.parentPlaylist;

    this.setIndex(settings.index);
    this.setParentPlaylist(settings.parentPlaylist);
  }

  setParentPlaylist (playlist) {
    if (!(playlist instanceof Playlist || playlist === null)) {
      throw new Error('setParentPlaylist(): The parameter must be an instance of Playlist or null.');
    }

    this._parentPlaylist = playlist;
  }

  getParentPlaylist () {
    return this._parentPlaylist;
  }

  setIndex (index) {
    this._index = index;
  }

  getAudio () {
    return this._audio;
  }

  getInfo () {
    return {
      artist: this._artist,
      title: this._title,
      album: this._album,
      artwork: this._artwork,
      audio: this._audio,
      index: this._index,
      rating: this._rating
    };
  }

  _createHTML () {
    if (!this._html) {
      super._createHTML();
      this._addToDOM(BaseElement.createText(this._artist), 'title');
      this._addToDOM(BaseElement.createText(this._title), 'subtitle');
    }
  }
}
