import _ from 'lodash';
import uuid from 'uuid/v1';

export default class BaseElement {

    static create(tag) {
        return document.createElement(tag);
    }

    constructor(settings) {
       settings =  _.merge({
            id: uuid() 
        }, settings);

        this._id = settings.id;
        this._html = null;
    }

    createHTML() {
        if (!this._html) {
            this._html = BaseElement.create('div');
        }

        return this;
    }

    getHTML() {
        if (!this._html) {
            this.createHTML();
        }

        return this._html;
    }
}