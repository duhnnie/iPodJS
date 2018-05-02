import _ from 'lodash';
import BaseElement from './BaseElement';

export default class Track extends BaseElement {
  constructor (settings) {
    super(settings);

    settings = _.merge({
      artist: '[unknown artist]',
      title: '[untitled]'
    }, settings);

    this._artist = settings.artist;
    this._title = settings.title;
    this._elementTag = 'li';
  }

  _createHTML () {
    if (!this._html) {
      super._createHTML();

      this._html.appendChild(BaseElement.createText(`${this._artist} - ${this._title}`));
    }
  }
}
