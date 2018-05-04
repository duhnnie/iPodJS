import _ from 'lodash';
import BaseElement from './BaseElement';
import ListItem from './ListItem';

export default class Track extends ListItem {
  constructor (settings) {
    super(settings);

    settings = _.merge({
      artist: '[unknown artist]',
      title: '[untitled]'
    }, settings);

    this._artist = settings.artist;
    this._title = settings.title;
  }

  _createHTML () {
    if (!this._html) {
      super._createHTML();
      this._addToDOM(BaseElement.createText(this._artist), 'title');
      this._addToDOM(BaseElement.createText(this._title), 'subtitle');
    }
  }
}
