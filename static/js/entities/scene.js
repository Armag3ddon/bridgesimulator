import Entity from './entity.js';
import graphic from './../basic/graphic.js';

export default class Scene extends Entity {
	constructor(name) {
		super();
		this.name = name;
	}

	/**
	 * @param {string} url
	 */
	setBackground(url) {
		this.bg = url;
	}

	/**
	 * @param {any} color
	 */
	setBackgroundColor(color) {
		this.bgcolor = color;
	}

	getName() {
		return this.name;
	}

	destroy() {
		this.parent.removeScene(this.name);
	}

	onDraw(ctx) {
		if (this.bgcolor) {
			ctx.fillStyle = this.bgcolor;
			ctx.fillRect(0,0, this.parent.size.x, this.parent.size.y);
		}
		if (this.bg) {
			ctx.drawImage(graphic[this.bg], 0, 0);
		}
	}
}