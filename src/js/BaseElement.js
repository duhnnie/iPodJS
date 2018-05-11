import _ from 'lodash';
import uuid from 'uuid/v1';

export default class BaseElement {
  static create (tag, cssClass = null, id = null) {
    const elem = document.createElement(tag);

    cssClass = _.isArray(cssClass) ? cssClass : (cssClass && cssClass.split(' ')) || [];

    if (id) {
      elem.setAttribute('id', id);
    }

    // We could call classList.add() just once sending all classes en the arguments list
    // but IE11 doesn't support more than a single argument, that's why we call it one time per class
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

  _resolveElement (element) {
    if (!element) {
      element = this._html;
    } else if (typeof element === 'string') {
      element = this._dom[element];
    } else if (!(element instanceof window.HTMLElement)) {
      throw new Error('_addToDOM(): The second parameter must be a string, object or null.');
    }

    element = element || this._html;

    return element;
  }

  _addToDOM (child, parent = null, key = null) {
    parent = this._resolveElement(parent);
    parent.appendChild(child);

    if (typeof key === 'string') {
      this._dom[key] = child;
    }
  }

  _clear (element) {
    element = this._resolveElement(element);

    while (element.childNodes.length) {
      element.removeChild(element.childNodes[0]);
    }
  }

  _setToDOM (child, parent = null, key = null) {
    this._clear(parent);

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
