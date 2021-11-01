import Entity from './entity.js';
import ImageEntity from './imageentity.js';
import RectEntity from './rectentity.js';
import V2, {Zero} from '../geo/v2.js';
import Scrollbar from './scrollbar.js';

export default class Scrollfield extends Entity {
	constructor() {
		super();

		this.scrollbarVertical = null;
		this.scrollbarHorizontal = null;

		this.rect = null;
		this.image = null;
	}

	onDynamic(json) {
		if (json.image) this.imageBar(json.image);
		if (json.rect) this.rectBar(json.rect);
	}

	imageBackground(source) {
		this.image = new ImageEntity(Zero(), source);
		this.image.fitToSize();
		this.add(this.image);
	}

	rectBackground(color) {
		this.rect = new RectEntity();
		this.rect.setColor(color);
		this.add(this.rect);
	}

	setHorizontalScrollbar(json) {
		this.scrollbarHorizontal = new Scrollbar();
		if (json.thickness) this.scrollbarHorizontal.setThickness(json.thickness);
		if (json.rect) this.scrollbarHorizontal.rectBar(json.rect);
		if (json.image) this.scrollbarHorizontal.imageBar(json.image);
		if (json.rectScroller) this.scrollbarHorizontal.rectScroller(json.rectScroller);
		if (json.imageScroller) this.scrollbarHorizontal.imageScroller(json.imageScroller);
		this.scrollbarHorizontal.setPosition(this.size.x - this.scrollbarHorizontal.thickness, 0);
		this.scrollbarHorizontal.setSize(this.scrollbarHorizontal.thickness, this.size.y);
		this.scrollbarHorizontal.visible = false;
		this.add(this.scrollbarHorizontal);
	}

	setVerticalScrollbar(json) {
		this.scrollbarVertical = new Scrollbar();
		if (json.thickness) this.scrollbarVertical.setThickness(json.thickness);
		if (json.rect) this.scrollbarVertical.rectBar(json.rect);
		if (json.image) this.scrollbarVertical.imageBar(json.image);
		if (json.rectScroller) this.scrollbarVertical.rectScroller(json.rectScroller);
		if (json.imageScroller) this.scrollbarVertical.imageScroller(json.imageScroller);
		this.scrollbarVertical.setPosition(0, this.size.y - this.scrollbarVertical.thickness);
		this.scrollbarVertical.setSize(this.size.x, this.scrollbarVertical.thickness);
		this.scrollbarVertical.setDirection('vertical');
		this.scrollbarVertical.visible = false;
		this.add(this.scrollbarVertical);
	}

	getContentEntities() {
		const entities = [];
		for (let i = 0; i < this.entities.length; i++) {
			const entity = this.entities[i];
			if (entity == this.rect) continue;
			if (entity == this.image) continue;
			if (entity == this.scrollbarHorizontal) continue;
			if (entity == this.scrollbarVertical) continue;

			entities.push(entity);
		}

		return entities;
	}

	onScrollbarMove() {
		const content = this.getContentEntities();
		if (!content.length) return;

		let x = 0;
		let y = 0;

		if (this.scrollbarHorizontal && this.scrollbarHorizontal.visible) {
			x -= this.scrollbarHorizontal.currentPosition;
		}
		if (this.scrollbarVertical && this.scrollbarVertical.visible) {
			y -= this.scrollbarVertical.currentPosition;
		}

		for (let i = 0; i < content.length; i++) {
			content[i].setPosition(x, y);
		}
	}

	onResize() {
		// Fixed dimensions get unfixed if a corresponding scollbar exists
		let fixedWidth = true;
		let fixedHeight = true;

		// Always position scrollbars, even if those are not visible
		if (this.scrollbarHorizontal) {
			this.scrollbarHorizontal.setPosition(
				0,
				this.size.y - this.scrollbarHorizontal.thickness);
			this.scrollbarHorizontal.setSize(
				this.size.x,
				this.scrollbarHorizontal.thickness);
			fixedWidth = false;
		}
		if (this.scrollbarVertical) {
			this.scrollbarVertical.setPosition(
				this.size.x - this.scrollbarVertical.thickness,
				0);
			this.scrollbarVertical.setSize(this.scrollbarVertical.thickness, this.size.y);
			fixedHeight = false;
		}

		// Check if any entity is bigger than the allowed size
		let xoverflow = 0;
		let yoverflow = 0;
		const content = this.getContentEntities();

		for (let i = 0; i < content.length; i++) {
			if (content[i].size.x > xoverflow) xoverflow = content[i].size.x;
			if (content[i].size.y > yoverflow) yoverflow = content[i].size.y;
		}

		const backgroundSize = this.size.clone();

		// Make scrollbars visible if necessary
		if (xoverflow > this.size.x && !fixedWidth) {
			this.scrollbarHorizontal.visible = true;
			this.scrollbarHorizontal.setRange(xoverflow);
			backgroundSize.y -= this.scrollbarHorizontal.thickness;
		}
		if (yoverflow > this.size.y && !fixedHeight) {
			this.scrollbarVertical.visible = true;
			this.scrollbarVertical.setRange(yoverflow);
			backgroundSize.x -= this.scrollbarVertical.thickness;
		}

		// Resize background
		if (this.rect) {
			this.rect.setPosition(Zero());
			this.rect.setSize(backgroundSize.x, backgroundSize.y);
		}
		if (this.image) {
			this.image.setPosition(Zero());
			this.image.setSize(backgroundSize.x, backgroundSize.y);
		}

		// Finally, resize content entities
		if (fixedWidth || fixedHeight) {
			for (let i = 0; i < content.length; i++) {
				if (fixedWidth) content[i].size.x = backgroundSize.x;
				if (fixedHeight) content[i].size.y = backgroundSize.y;
			}
		}

		// And reposition
		this.onScrollbarMove();
	}

	onDraw(ctx) {
		ctx.rect(0,0, this.size.x, this.size.y);
		ctx.clip();
	}

	postDraw(ctx) {
		if (this.scrollbarHorizontal) this.scrollbarHorizontal.draw(ctx);
		if (this.scrollbarVertical) this.scrollbarVertical.draw(ctx);
	}
}