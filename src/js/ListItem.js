import BaseElement from './BaseElement';

export default class ListItem extends BaseElement {
  constructor (settings) {
    super(settings);

    settings = {
      onClick: null,
      ...settings,
    };

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
    this._html.classList.add('playing');
  }

  hidePlayingIcon () {
    this._html.classList.remove('playing');
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
    return ['playlist'];
  }

  _createHTML () {
    if (!this._html) {
      const link = BaseElement.create('a');
      const textContainer = BaseElement.create('div');
      const title = BaseElement.create('div');
      const subtitle = BaseElement.create('div');

      super._createHTML();

      link.setAttribute('href', '#');
      link.classList.add('link');
      title.classList.add('title');
      subtitle.classList.add('subtitle');

      this._addToDOM(link, null, 'link');
      this._addToDOM(textContainer, 'link', 'textContainer');
      this._addToDOM(title, 'textContainer', 'title');
      this._addToDOM(subtitle, 'textContainer', 'subtitle');

      this._addEventListeners();
    }
  }
}
