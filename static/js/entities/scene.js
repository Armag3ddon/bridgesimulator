import Entity from './entity.js';
import graphic from './../basic/graphic.js';
import Colors from '../definition/colors.js';

/** @module Scene */
export default class Scene extends Entity {
	/** 
	 * A scene entity must always be the top most entity to be added to GameCore. Size will be auto-set when adding the scene.
	 * @extends Entity
	 * @param {String} name - The name of this scene. Only one scene of any given name can be added to GameCore.
	 */
	constructor(name) {
		super();
		this.bgcolor = Colors.defaultSceneBackground;

		this.name = name;
		this.size = window.gamecore.size.clone();
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
		if (this.bgcolor) {
			ctx.fillStyle = this.bgcolor;
			ctx.fillRect(0,0, this.parent.size.x, this.parent.size.y);
		}
		if (this.bg) {
			ctx.drawImage(graphic[this.bg], 0, 0);
		}
	}
}