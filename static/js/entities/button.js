import Entity from './entity.js';
import  TextEntity from './textentity.js';
import  ImageEntity from './imageentity.js';
import RectEntity from './rectentity.js';
import {Zero} from '../geo/v2.js';

export default class Button extends Entity {
	constructor() {
		super();

		this.text = null;
		this.image = null;
		this.rect = null;

		this.onClick = p => {
			callback(p);
			return true;
		};
	}

	shrink2Fit() {
		this.shrink2fit = true;
	}

	textButton(text, font) {
		this.text = new TextEntity(Zero(), text, font);

		this.add(this.text);

		return this;
	}

	imageButton(source) {
		this.image = new ImageEntity(Zero(), source);

		if (!this.shrink2fit) {
			this.image.fitToSize();
		}
		this.add(this.image);

		return this;
	}

	rectButton(color) {
		const rect = new RectEntity(Zero(), Zero(), color, 2);

		this.add(rect);

		return this;
	}

	setText(text) {
		if (!this.text) return;

		this.text.setText(text);
	}

	seti18nText(key) {
		if (!this.text) return;
		
		this.text.seti18nText(key);
	}

	onMouseDown() {
		return true;
	}

	onResize() {
		if (this.shrink2fit) {
			if (this.image && this.image.image) {
				const offset = Zero();
				offset.x = Math.round((this.size.x - this.image.image.width) / 2);
				offset.y = Math.round((this.size.y - this.image.image.height) / 2);
				this.position.add(offset);
				this.size.x = this.image.image.width;
				this.size.y = this.image.image.height;
			}
		} else {
			for (let i = 0; i < this.entities.length; i++) {
				if (this.entities[i] != this.text) {
					this.entities[i].size = this.size.clone();
				} else {
					// Center the text
					this.entities[i].center();
				}
			}
		}
	}
}