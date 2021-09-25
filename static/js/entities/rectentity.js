import Entity from './entity.js';
import V2 from '../geo/v2.js';

export default class RectEntity extends Entity {
	constructor(pos, size, color) {
		super(pos, size);
		this.color = color;
		this.drawArea = new V2(this.size.x, this.size.y);
	}

	unfoldEffect(time, callback) {
		this.unfolding = time;
		this.unfolded = 0;
		this.drawArea.y = 1;
		this.onFinished = callback;
	}

	onDraw(ctx) {
		this.color.apply(ctx, this.hover());
		ctx.fillRect(0, 0, this.drawArea.x | 0, this.drawArea.y | 0);
		ctx.strokeRect(0, 0, this.drawArea.x | 0, this.drawArea.y | 0);
	}
}