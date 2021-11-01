import Entity from './entity.js';
import {Zero} from '../geo/v2.js';

export default class RectEntity extends Entity {
	constructor() {
		super();
		this.color = null;
		this.drawArea = Zero();
		this.lineWidth = 1;
	}

	setColor(color) {
		this.color = window.gamecore.painter[color];
	}

	setLineWidth(width) {
		this.lineWidth = width;
	}

	onDynamic(json) {
		this.setColor(json.color);
		if (json.lineWidth) this.setLineWidth(json.lineWidth);
	}

	onDraw(ctx) {
		this.color.apply(ctx, this.hover());
		ctx.lineWidth = this.lineWidth;
		ctx.fillRect(0, 0, this.drawArea.x | 0, this.drawArea.y | 0);
		ctx.strokeRect(0, 0, this.drawArea.x | 0, this.drawArea.y | 0);
	}

	onResize() {
		this.drawArea.x = this.size.x;
		this.drawArea.y = this.size.y;
	}
}