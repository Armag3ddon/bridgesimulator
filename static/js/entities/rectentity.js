import Entity from './entity.js';
import {Zero} from '../geo/v2.js';
import Colors from '../definition/colors.js';

export default class RectEntity extends Entity {
	constructor() {
		super();
		this.color = null;
		this.drawArea = Zero();
		this.lineWidth = 1;
	}

	setColor(color) {
		this.color = color;
	}

	onDynamic(json) {
		this.color = Colors[json.color];
		if (json.lineWidth) this.lineWidth = json.lineWidth;
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