import {Zero} from '../geo/v2.js';

export default class DOMEntity {
	constructor(inputType) {
		this.position = Zero();
		this.size = Zero();
		this.parent = null;

		this.id = Math.random().toString();
		while (document.getElementById(this.id) != null)
			this.id = Math.random().toString();
		this.element = document.createElement('input');
		this.element.setAttribute('type', inputType);
		this.element.setAttribute('size', 30);
		this.element.id = this.id;
		const self = this;
		this.element.onkeyup = (event) => { self.onKeyUp(event); };

		document.getElementById('ui').appendChild(this.element);
	}

	setParent(p) {
		this.parent = p;
	}

	destroy() {
		this.element.remove();
		this.parent.remove(this);
	}

	onKeyUp(event) {
		// Enter pressed
		if (event.key == 'Enter')
			this.onEnter();
	}

	onEnter() {
		this.parent.onDOMEntityEnter(this.element.value);
	}
}