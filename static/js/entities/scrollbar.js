import Entity from './entity.js';
import ImageEntity from './imageentity.js';
import RectEntity from './rectentity.js';
import {Zero} from '../geo/v2.js';

export default class Scrollbar extends Entity {
	constructor() {
		super();

		this.scroller = null;
		this.fixedScroller = false;
		this.image = null;
		this.rect = null;

		this.direction = 'horizontal';
		this.range = 0;
		this.currentPosition = 0;
		this.dragged = false;
		this.thickness = 20;
	}

	onDynamic(json) {
		if (json.image) this.imageBar(json.image);
		if (json.rect) this.rectBar(json.rect);
	}

	setDirection(direction) {
		this.direction = direction;
	}

	setRange(range) {
		this.range = range;
		if (this.currentPosition > range) this.currentPosition = range;

		this.resizeScroller();
	}

	setThickness(thickness) {
		this.thickness = thickness;

		this.resizeScroller();
	}

	setCurrentPosition(position) {
		this.currentPosition = position;

		this.repositionScroller();
	}

	imageBar(source) {
		this.image = new ImageEntity(Zero(), source);
		this.image.fitToSize();
		this.add(this.image);
	}

	rectBar(color) {
		this.rect = new RectEntity();
		this.rect.setColor(color);
		this.add(this.rect);
	}

	imageScroller(source) {
		this.scroller = new ImageEntity();
		this.scroller.setImage(source);
		this.add(this.scroller);
		this.fixedScroller = true;
	}

	rectScroller(color) {
		this.scroller = new RectEntity();
		this.scroller.setColor(color);
		this.scroller.setLineWidth(2);
		this.add(this.scroller);
	}

	calculateScrollerPosition() {
		let size = this.size.x - this.scroller.size.x;
		if (this.direction == 'vertical') size = this.size.y - this.scroller.size.y;

		const step = size / this.range;

		return Math.round(this.currentPosition * step);
	}

	calculateScrollerLength() {
		let scrollerScale = this.size.y / this.range;
		if (this.direction == 'vertical') {
			scrollerScale = this.size.x / this.range;
		}
		if (scrollerScale > 1) scrollerScale = 1;

		let size = this.size.y * scrollerScale;
		if (this.direction == 'vertical') {
			size = this.size.x * scrollerScale;
		}

		// Rule of thumb: the scroller should never be smaller than the bar's thickness
		if (size < this.thickness) size = this.thickness;

		return Math.round(size);
	}

	resizeScroller() {
		if (!this.scroller) return;

		if (this.fixedScroller) {
			if (this.direction == 'vertical') {
				this.scroller.resizeToWidth(this.thickness);
			} else {
				this.scroller.resizeToHeight(this.thickness);
			}
		} else {
			let width = this.thickness;
			let height = this.calculateScrollerLength();
			if (this.direction == 'vertical') {
				width = height;
				height = this.thickness;
			}

			this.scroller.setSize(width, height);
		}
	}

	repositionScroller() {
		if (!this.scroller) return;

		const scrollerPosition = this.calculateScrollerPosition();
		let x = scrollerPosition;
		let y = 0;
		if (this.direction == 'vertical') {
			x = 0;
			y = scrollerPosition;
		}

		this.scroller.setPosition(x, y);
	}

	onMouseDown() {
		if (!this.visible) return false;

		this.dragged = true;
		return true;
	}

	onMouseUp() {
		if (this.dragged) {
			this.dragged = false;
			return true;
		}
	}

	onResize() {
		if (this.rect) {
			this.rect.setPosition(Zero());
			this.rect.setSize(this.size.clone());
		}
		if (this.image) {
			this.image.setPosition(Zero());
			this.image.setSize(this.size.clone());
		}

	}

	onUpdate() {
		if (this.dragged) {
			// Get the current relative mouse position according to alignment
			let dragDimension = this.relativeMouse().y;
			let testDimension = this.size.y;
			const scrollerLength = this.calculateScrollerLength();
			if (this.direction == 'horizontal') {
				dragDimension = this.relativeMouse().x;
				testDimension = this.size.x;
			}
			// Mouse is beyond our dimensions (with regard to the scroller length)
			if (dragDimension <= scrollerLength / 2) {
				// Snap to zero
				this.currentPosition = 0;
			} else if(dragDimension >= testDimension - scrollerLength / 2) {
				// Snap to maximum
				this.currentPosition = this.range;
			} else {
				// Mouse is inbetween our boundaries
				testDimension -= scrollerLength;
				dragDimension -= scrollerLength / 2;
				const pixelStep = this.range / testDimension;
				this.currentPosition = pixelStep * dragDimension;
			}
			if (this.parent && this.parent.onScrollbarMove) this.parent.onScrollbarMove();
			
			this.repositionScroller();
		}
	}
}