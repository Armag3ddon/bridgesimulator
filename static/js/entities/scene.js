import Entity from './entities/entity.js';
import graphic from './../basic/graphic.js';

export default class Scene extends Entity {
	constructor(name) {
		super();
		this.name = name;
	}

	setBackground(url) {
		this.bg = url;
	}

	getName() {
		return this.name;
	}

	destroy() {
		this.parent.removeScene(this.name);
	}

	onDraw(ctx) {
		if (this.bg) {
			ctx.drawImage(graphic[this.bg], 0, 0);
		}
	}
}