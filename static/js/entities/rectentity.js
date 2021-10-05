import Entity from './entity.js';
import V2 from '../geo/v2.js';

export default class RectEntity extends Entity {
	constructor(pos, size, color, lineWidth) {
		super(pos, size);
		this.color = color;
		this.drawArea = new V2(this.size.x, this.size.y);
		this.lineWidth = lineWidth || 1;
	}

	onDraw(ctx) {
		this.color.apply(ctx, this.hover());
		ctx.lineWidth = this.lineWidth;
		ctx.fillRect(0, 0, this.drawArea.x | 0, this.drawArea.y | 0);
		ctx.strokeRect(0, 0, this.drawArea.x | 0, this.drawArea.y | 0);
	}

	onResize(gamecore) {
		this.drawArea.x = this.size.x;
		this.drawArea.y = this.size.y;
	}
}