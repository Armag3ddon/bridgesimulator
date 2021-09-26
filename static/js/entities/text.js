import Entity from './entity.js';
import fonts from './../basic/fonts.js';

export default class TextEntity extends Entity {
	constructor(pos, text, font, size) {
		super(pos, size);
		this.text = [text];
		this.font = font;
		this.renewwrap = false;
		this.wrap = false;
	}
	
	// Set to parent's size minus margin
	setMargin(margin) {
		this.position.x = margin;
		this.position.y = margin;
		this.size.x = this.parent.size.x - margin;
		this.size.y = this.parent.size.y - margin;
	}

	setText(text) {
		if (Object.prototype.toString.call(text) == '[object String]') {
			this.text = [text];
		} else {
			this.text = text;
		}
		if (this.wrap) this.renewwrap = true;
	}

	addText(text) {
		if (Object.prototype.toString.call(text) == '[object String]') {
			this.text.push(text);
		} else {
			this.text.concat(text);
		}
		if (this.wrap) this.renewwrap = true;
	}
	
	setWrap(val) {
		this.wrap = val;
		if (val) this.renewwrap = true;
	}

	// Get a localised text from the server
	seti18nText(gamecore, key) {
		var self = this;
		gamecore.geti18n(key, (response) => {
			self.setText(response);
		})
	}

	addi18nText(gamecore, key) {
		var self = this;
		gamecore.geti18n(key, (response) => {
			self.addText(response);
		})
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
			// text != '' makes sure that at least one word is added,
			// even if it is too big. This will create overflow.
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
		fonts.apply(ctx, this.font);
		if (this.renewwrap)
			this.calculateWrap(ctx);
		let y = 0;
		// Space between lines is 20% of the text size
		const increase = parseInt(this.font.size) + Math.floor(parseInt(this.font.size) / 5);
		for (let i = 0; i < this.text.length; i++) {
			ctx.fillText(this.text[i], 0, y);
			y += increase;
		}
	}
}