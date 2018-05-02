import _ from 'lodash';
import uuid from 'uuid/v1';

export default class BaseElement {
  static create (tag) {
    return document.createElement(tag);
  }

  constructor (settings) {
    settings = _.merge({
      id: uuid()
    }, settings);

    this._html = null;

    this.setId(settings.id);
  }

  setId (id) {
    this._id = id;

    if (this._html) {
      this._html.setAttribute('id', id);
    }
  }

  _createHTML () {
    if (!this._html) {
      this._html = BaseElement.create('div');

      this.setId(this._id);
    }

    return this;
  }

  getHTML () {
    if (!this._html) {
      this._createHTML();
    }

    return this._html;
  }
}
