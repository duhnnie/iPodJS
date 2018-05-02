export class BaseElement {

    static create(tag) {
        return document.createElement(tag);
    }

    constructor() {
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