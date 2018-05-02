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
  }
}
