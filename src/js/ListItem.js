import _ from 'lodash';
import BaseElement from './BaseElement';
import listItemStyle from '../css/listitem.css';

export default class ListItem extends BaseElement {
  constructor (settings) {
    super(settings);

    settings = _.merge({
      onClick: null
    }, settings);

    this._elementTag = 'li';
    this._onClick = null;

    this.setOnClick(settings.onClick);
  }

  setOnClick (callback) {
    if (callback === null || typeof callback === 'function') {
      this._onClick = callback;
    } else {
      throw new Error('setOnClick(): The parameter must be a function or null.');
    }
  }

  showPlayingIcon () {
    this._html.classList.add(listItemStyle['playing']);
  }

  hidePlayingIcon () {
    this._html.classList.remove(listItemStyle['playing']);
  }

  _onClickHandler (e) {
    e.preventDefault();

    if (this._onClick) {
      this._onClick(this);
    }
  }

  _addEventListeners () {
    const link = this._getFromDOM('link');

    if (link) {
      link.addEventListener('click', this._onClickHandler.bind(this));
    }
  }

  _getRootClasses () {
    return [listItemStyle['playlist']];
  }

  _createHTML () {
    if (!this._html) {
      const link = BaseElement.create('a');
      const title = BaseElement.create('div');
      const subtitle = BaseElement.create('div');

      super._createHTML();

      link.setAttribute('href', '#');
      link.classList.add(listItemStyle['link']);
      title.classList.add(listItemStyle['title']);
      subtitle.classList.add(listItemStyle['subtitle']);

      this._addToDOM(link, null, 'link');
      this._addToDOM(title, 'link', 'title');
      this._addToDOM(subtitle, 'link', 'subtitle');

      this._addEventListeners();
    }
  }
}
