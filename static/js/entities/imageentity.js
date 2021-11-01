import graphics from '../basic/graphic.js';
import V2 from '../geo/v2.js';
import Entity from './entity.js';

export default class ImageEntity extends Entity {
	constructor() {
		super();

		this.scale = 1;
		this.keepproportions = true;
	}

	setImage(source) {
		if (!graphics[source]) {
			this.temp = source;
			graphics.load([source], this.onImageLoaded.bind(this));
		} else {
			this.size = new V2(graphics[source].width, graphics[source].height);
			this.image = graphics[source];
		}
	}

	fitToSize() {
		this.keepproportions = false;
	}

	resizeToWidth(width) {
		this.scale = width / this.size.x;
		this.size.x = Math.floor(this.size.x * this.scale);
		this.size.y = Math.floor(this.size.y * this.scale);
	}

	resizeToHeight(height) {
		this.scale = height / this.size.y;
		this.size.x = Math.floor(this.size.x * this.scale);
		this.size.y = Math.floor(this.size.y * this.scale);
	}

	onImageLoaded() {
		this.image = graphics[this.temp];
		this.temp = null;
		if (this.size.x == 0 && this.size.y == 0) {
			this.size.x = this.image.width;
			this.size.y = this.image.height;
		} else {
			this.calculateScale();
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
				ctx.drawImage(this.image, 0, 0, this.image.width * this.scale, this.image.height * this.scale);
			} else {
				ctx.drawImage(this.image, 0, 0, this.size.x, this.size.y);
			}
		}
	}
}