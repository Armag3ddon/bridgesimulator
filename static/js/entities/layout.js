import Entity from './entity.js';

export default class Layout extends Entity {
	constructor(position, size, align, spacing, flexibleminimum) {
		super(position, size);

		this.align = align;
		this.spacing = spacing;
		this.flexibleminimum = flexibleminimum;
	}

	add(entity) {
		super.add(entity);

		this.onResize();
	}

	calculateSize(length, amount, spacing) {
		let size;
		const minimum = amount * this.flexibleminimum;
		// There is enough space
		if (minimum + spacing * (amount - 1) > length) {
			size = Math.floor((length - spacing * (amount - 1)) / amount);
		} else {
			// Shrink spacing to a maximum of 0
			size = this.flexibleminimum;
			spacing = Math.max(0, Math.floor((length - size * amount)));
		}
		return { size: size, spacing: spacing };
	}

	onResize() {
		let x = 0, y = 0, width, height, xincrease, yincrease, result;
		if (this.align = 'horizontal') {
			result = this.calculateSize(this.size.x, this.entities.length, this.spacing);
			xincrease = result.size + result.spacing;
			yincrease = 0;
			width = result.size;
			height = this.size.y;
		}
		if (this.align = 'vertical') {
			result = this.calculateSize(this.size.y, this.entities.length, this.spacing);
			xincrease = 0;
			yincrease = result.size + result.spacing;
			width = this.size.x;
			height = result.size;
		}
		for (let i = 0; i < this.entities.length; i++) {
			this.entities[i].position.x = x;
			this.entities[i].position.y = y;
			this.entities[i].size.x = width;
			this.entities[i].size.y = height;
			x += xincrease;
			y += yincrease;
		}
	}
}