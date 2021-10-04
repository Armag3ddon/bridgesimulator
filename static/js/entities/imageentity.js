import graphics from '../basic/graphic.js';
import V2 from '../geo/v2.js';
import {Zero} from '../geo/v2.js';
import Entity from './entity.js';

export default class ImageEntity extends Entity {
	constructor(position, source) {
		if (!graphics[source]) {
			super(position, Zero());
			this.temp = source;
			graphics.load([source], this.onImageLoaded.bind(this));
		} else {
			super(position, new V2(graphics[source].width, graphics[source].height));
			this.image = graphics[source];
		}

		this.scale = 1;
		this.keepproportions = true;
	}

	fitToSize() {
		this.keepproportions = false;
	}
	
	onImageLoaded() {
		this.image = graphics[this.temp];
		this.temp = null;
		if (this.size.x == 0 && this.size.y == 0) {
			this.size.x = this.image.width;
			this.size.y = this.image.height;
		} else {
			calculateScale();
		}
	}

	calculateScale() {
		const scalex = this.size.x / this.image.width;
		const scaley = this.size.y / this.image.height;
		this.scale = Math.min(scalex, scaley);
	}
	
	onResize() {
		this.calculateScale();
	}

	onDraw(ctx) {
		if (!this.image) return;

		if (this.size.x >= 1 && this.size.y >= 1) {
			if (this.keepproportions) {
				ctx.drawImage(this.image, 0, 0, this.image.width * scale, this.image.height * scale);
			} else {
				ctx.drawImage(this.image, 0, 0, this.size.x, this.size.y);
			}
		}
	}
}