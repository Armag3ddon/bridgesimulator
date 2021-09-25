import Entity from '../entities/entity.js';
import V2 from '../geo/v2.js';

/* Animation for the RectEntity
Add to any RectEntity for animation. Will draw the rectangle from top to bottom
and call callback when finished. Can be used e.g. for unfolding text boxes.
*/

export default class AnimationRectUnfold extends Entity {
	constructor(time, callback) {
		super();

		this.time = time;
		this.unfolded = 0;
		this.onFinished = callback;
	}

	onAdded() {
		this.parent.drawArea.y = 1;
	}

	onUpdate(delta) {
		this.unfolded += delta;

		if (this.unfolded >= this.time) {
			this.parent.drawArea.y = this.parent.size.y;
			if (this.onFinished)
				this.onFinished();
			return this.parent.remove(this);
		}
		const percentage = this.unfolded / this.time;
		this.parent.drawArea.y = Math.max(1, Math.min(this.parent.size.y, Math.round(this.parent.size.y * percentage)));
	}
}