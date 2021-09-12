import Entity from './entity.js';
import fonts from './../defaults/fonts.es6';

export default class TextEntity extends Entity {
	constructor(pos, text, font, size) {
		super(pos, size);
		this.text = [text];
		this.font = font || fonts.default;
		this.renewwrap = false;
		this.wrap = false;
	}

	setWrap(val) {
		this.wrap = val;
		if (val) this.renewwrap = true;
	}

	setText(text) {
		this.text = text;
		if (this.wrap) this.renewwrap = true;
	}

	calculateWrap(ctx) {
		let text = this.text.join(' ');
		const words = text.split(' ');
		const size = this.size.x;
		text = '';
		this.text = [];
		for (let i = 0; i < words.length; i++) {
			let newtext;
			if (i > 0)
				newtext += ' ';
			newtext += words[i];
			// text != '' makes sure that at least one word is added, even if it is too big
			if (ctx.measureText(text + newtext).size > size && text != '') {
				this.text.push(text);
				text = newtext.slice(1);
			} else {
				text += newtext;
			}
		}
		this.renewwrap = false;
	}

	onDraw(ctx) {
		this.font.apply(ctx, this.hover());
		if (this.renewwrap)
			this.calculateWrap(ctx);
		for (let i = 0; i < this.text.length; i++)
			ctx.fillText(this.text[i], 0, 0);
	}
}