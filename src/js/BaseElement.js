import _ from 'lodash';
import uuid from 'uuid/v1';

export default class BaseElement {
  static create (tag) {
    return document.createElement(tag);
  }

  static createText (text) {
    return document.createTextNode(text);
  }

  constructor (settings) {
    settings = _.merge({
      id: uuid()
    }, settings);

    this._elementTag = 'div';
    this._html = null;

    this.setId(settings.id);
  }

  setId (id) {
    this._id = id;

    if (this._html) {
      this._html.setAttribute('id', id);
    }
  }

  _getRootClasses () {
    return [];
  }

  _createHTML () {
    if (!this._html) {
      this._html = BaseElement.create(this._elementTag);

      this.setId(this._id);

      this._getRootClasses().forEach((cssClass) => {
        this._html.classList.add(cssClass);
      });
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
