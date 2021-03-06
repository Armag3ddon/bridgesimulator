import Entity from './entity.js';
import graphic from './../basic/graphic.js';

/** @module Scene */
export default class Scene extends Entity {
	/** 
	 * A scene entity must always be the top most entity to be added to GameCore. Size will be auto-set when adding the scene.
	 * @extends Entity
	 * @param {String} name - The name of this scene. Only one scene of any given name can be added to GameCore.
	 */
	constructor(name) {
		super();

		this.name = name;
		this.size = window.gamecore.size.clone();
		this.bgcolor = window.gamecore.painter.defaultSceneBackground;
	}

	onDynamic(json) {
		this.name = json.name;
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

	onResize() {
		this.size = this.parent.size.clone();
	}

	onDraw(ctx) {
		if (this.bgcolor && !this.bg) {
			ctx.fillStyle = this.bgcolor;
			ctx.fillRect(0,0, this.parent.size.x, this.parent.size.y);
		}
		if (this.bg) {
			ctx.drawImage(graphic[this.bg], 0, 0);
		}
	}
}