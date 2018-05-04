import _ from 'lodash';
import uuid from 'uuid/v1';

export default class BaseElement {
  static create (tag, cssClass = null, id = null) {
    const elem = document.createElement(tag);

    cssClass = _.isArray(cssClass) ? cssClass : (cssClass && cssClass.split(' ')) || [];

    if (id) {
      elem.setAttribute('id', id);
    }

    cssClass.forEach((cssClass) => elem.classList.add(cssClass));

    return elem;
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
    this._dom = {};

    this.setId(settings.id);
  }

  setId (id) {
    this._id = id;

    if (this._html) {
      this._html.setAttribute('id', id);
    }
  }

  _resolveParent (parent) {
    if (!parent) {
      parent = this._html;
    } else if (typeof parent === 'string') {
      parent = this._dom[parent];
    } else if (!(parent instanceof window.HTMLElement)) {
      throw new Error('_addToDOM(): The second parameter must be a string, object or null.');
    }

    parent = parent || this._html;

    return parent;
  }

  _addToDOM (child, parent = null, key = null) {
    parent = this._resolveParent(parent);
    parent.appendChild(child);

    if (typeof key === 'string') {
      this._dom[key] = child;
    }
  }

  _setToDOM (child, parent = null, key = null) {
    parent = this._resolveParent(parent);

    while (parent.childNodes.length) {
      parent.removeChild(parent.childNodes[0]);
    }

    this._addToDOM(child, parent, key);
  }

  _removeFromDOM (keyOrChild) {
    if (typeof keyOrChild === 'string') {
      this._dom[keyOrChild].remove();
      delete this._dom[keyOrChild];
    } else if (keyOrChild instanceof window.HTMLElement) {
      keyOrChild.remove();
    } else {
      throw new Error('_removeFromDOM(): The parameter must be a string or a HTMLElement');
    }
  }

  _getFromDOM (key) {
    return this._dom[key] || null;
  }

  _getRootClasses () {
    return [];
  }

  _addEventListeners () {}

  _createHTML () {
    if (!this._html) {
      this._html = BaseElement.create(this._elementTag);

      this.setId(this._id);

      this._getRootClasses().forEach((cssClass) => {
        this._html.classList.add(cssClass);
      });

      this._addEventListeners();
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
