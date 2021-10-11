import Entity from './entity.js';
import fonts from '../basic/fonts.js';

/** @module TextEntity */
export default class TextEntity extends Entity {
	/** 
	 * This entity draws text on the canvas. In its most basic form, it will just draw a single line of text.
	 * @extends Entity
	 * @param {V2} pos - The position of this entity.
	 * @param {*} text - Initial text to be displayed. Can be string for a single line or an array for multiple lines. Line height is 120% text size.
	 * @param {JSON} font - A font definition in the style of definition/fonts.
	 * @param {V2} size - The size of this entity. The size is ignored for text display unless one of the options that make use of the size is set.
	 */
	constructor() {
		super();

		// If true, line breaks will be put in whenever the text exceeds
		// our dimensions
		this.wrap = false;
		// To save computing power, line breaks will not be computed
		// every draw cycle, only if changes in the text occur
		this.renewwrap = false;
		// Keep text drawing within dimensions
		this.textboxstyle = false;
		// Regular line height: 20% of text size
		this.lineheight = 20;
		// Regular style: draw lines of text beginning at the top
		this.top2bottom = true;
		// Shrink text to fit into the dimension. Size will be given
		// as maxWidth parameter to fillText(). Usually, this option
		// fits a single line of text.
		this.shrink2fit = false;
		// A margin in pixels that will be applied in reference to
		// the parent entity
		this.margin = 0;
		// How many lines of text (not counting sub-lines created by
		// calculateWrap) does this entity keep in store
		this.bufferSize = 20;
	}

	/**
	 * Replace the displayed text entirely.
	 * @param {*} text - Can be string for a single line or an array for multiple lines.
	 */
	setText(text) {
		if (Object.prototype.toString.call(text) == '[object String]') {
			this.text = [text];
		} else {
			this.text = text;
		}
		this.checkBuffer();
		if (this.wrap) {
			this.renewwrap = true;
		} else {
			if (this.parent) this.measureArea();
		}
	}

	/**
	 * Add (a) new line(s) at the end of the text.
	 * @param {*} text - Can be string for a single line or an array for multiple lines.
	 */
	addText(text) {
		if (Object.prototype.toString.call(text) == '[object String]') {
			this.text.push(text);
		} else {
			this.text.concat(text);
		}
		this.checkBuffer();
		if (this.wrap) this.renewwrap = true;
	}

	/**
	 * Like setText(). Request a localised string from the server. The text will be updated when the response from the server is received.
	 * @param {*} key - Can be either string, array or JSON. String: retrieves a single line; Array: filled with strings, retrieves multiple lines; JSON: in the form of { request: String/Array, keys: { ... } }, keys will be passed along to i18next for interpolation.
	 */
	seti18nText(key) {
		window.gamecore.geti18n(key, this.setText.bind(this);
	}

	/**
	 * Like addText(). Request a localised string from the server. The text will be added when the response from the server is received.
	 * @param {*} key - Can be either string, array or JSON. String: retrieves a single line; Array: filled with strings, retrieves multiple lines; JSON: in the form of { request: String/Array, keys: { ... } }, keys will be passed along to i18next for interpolation.
	 */
	addi18nText(gamecore, key) {
		window.gamecore.geti18n(key, this.addText.bind(this);
	}

	/**
	 * Set the space between two lines in percent of the text size.
	 * @param {int} height - New line height. Default: 20 (= 20%).
	 */
	setLineHeight(height) {
		this.lineheight = height;
		if (!this.wrap) this.measureArea();
	}

	/**
 	 * Set the size to the parent's size minus margin on all sides.
	 * @param {int} margin - Margin size in px.
	 */
	setMargin(margin) {
		this.position.x = margin;
		this.position.y = margin;
		this.size.x = this.parent.size.x - margin;
		this.size.y = this.parent.size.y - margin;
		this.margin = margin;
	}

	/**
	 * Reverse the default drawing order. The default drawing will draw text starting at the top. With this set, the first line of text is drawn at the bottom and then going up.
	 */
	setBottom2Top() {
		this.top2bottom = false;
	}

	/**
	 * Keep text within size.x limits by using the maxWidth parameter of canvas.fillText(). This options is probably only useful single lines of text.
	 */
	shrink2Fit() {
		this.shrink2fit = true;
	}

	/**
	 * This will keep the text within the limits of this entity. Also, the text will be scrolled if necessary, so that the last (newest) line of text is always visible. Includes setWrap().
	 */
	setTextboxstyle() {
		this.textboxstyle = true;
		this.setWrap(this.size.x);
	}

	/**
	 * This will make sure that long lines of text will break when exceeding a certain length. However, at least one word gets added per line. This will create overflow for small sizes and long words. Line break will be added at spaces, no hyphenation takes place.
	 * @param {int} length - The maximum length in px that should not be exceeded.
	 */
	setWrap(length) {
		this.wrap = length;
		if (length) this.renewwrap = true;
	}

	/**
	 * Change the size of the text buffer. The entity will only keep that many lines of text (not counting line break by automated wrapping) and delete older ones. Default buffer size is 20.
	 * @param {int} size - New buffer sizes. Set to -1 for infinite.
	 */
	setBuffer(size) {
		this.bufferSize = size;
	}

	// Get the size of one full line of text (text size + space)
	calculateLineHeight() {
		return parseInt(this.font.size) + Math.floor(parseInt(this.font.size) * this.lineheight / 100);
	}

	// Will check this.text line by line for overflow out of the
	// allowed area (size of this entity). If line breaks are needed
	// a sub array will be created with as many lines as necessary
	calculateWrap(ctx) {
		let text, newtext, words, newwords;
		const size = this.size.y;
		for (let j = 0; j < this.text.length; j++) {
			if (!Array.isArray(this.text[j])) {
				text = this.text[j];
			} else {
				text = this.text[j].join(' ');
			}
			words = text.split(' ');
			text = '';
			newtext = [];

			for (let i = 0; i < words.length; i++) {
				newwords = '';
				if (i > 0)
					newwords += ' ';
				newwords += words[i];
				// text != '' makes sure that at least one word is added,
				// even if it is too big. This will create overflow.
				if (ctx.measureText(text + newwords).width > size && text != '') {
					newtext.push(text);
					text = newwords.slice(1);
				} else {
					if (newwords.trim()) text += newwords;
				}
			}
			if (text.trim())
				newtext.push(text);
			// Check if this line does now have a line break
			if (newtext.length > 1) {
				this.text[j] = newtext;
			} else {
				this.text[j] = newtext[0];
			}
		}

		this.renewwrap = false;
	}

	// Delete text lines of buffer size is reached
	checkBuffer() {
		if (this.bufferSize == -1) return;
		if (this.text.length > this.bufferSize) {
			this.text.slice(this.text.length - this.bufferSize);
		}
	}

	// Calculate the dimensions based on the text to be displayed
	// Incompatible with setWrap because with that, you supply the size
	measureArea() {
		let longestline = 0;
		for (let i = 1; i < this.text.length; i++) {
			if (this.text[i].length > longestline)
				longestline = i;
		}
		fonts.apply(window.gamecore.bufferCtx, this.font);
		this.size.x = Math.ceil(
			window.gamecore.bufferCtx.measureText(this.text[longestline]).width);
		this.size.y = this.calculateLineHeight() * this.text.length;
	}

	onAdded() {
		if (!this.wrap) this.measureArea();
	}

	onResize() {
		if (this.wrap) this.calculateWrap = true;
	}

	onDraw(ctx) {
		fonts.apply(ctx, this.font);
		if (this.renewwrap)
			this.calculateWrap(ctx);

		// Space between lines is 20% of the text size
		let lineheight = this.calculateLineHeight();

		let x = 0;
		let y = 0;
		
		if (this.font.textAlign == 'center') {
			x = this.size.x / 2;
		}

		if (!this.top2bottom) {
			lineheight *= -1;
			y = this.size.y + lineheight;
		}
		
		let start = 0;
		if (this.textboxstyle) {
			ctx.rect(0,0, this.size.x, this.size.y);
			ctx.clip();
			// Scroll text if necessary
			if (this.top2bottom) {
				const lines = this.text.reduce((count, element) => {
					if (Array.isArray(element)) return count + element.length;
					return count + 1;
				}, 0);
				// Check if the amount of lines exceeds our size
				if (lines * lineheight > this.size.y) {
					const howmany = Math.ceil(this.size.y / lineheight);
					start = Math.max(lines - howmany - 1, 0);
					y = this.size.y - howmany * lineheight;
				}
			}
		}

		let current;
		drawloop:
		for (let i = start; i < this.text.length; i++) {
			if (Array.isArray(this.text[i])) {
				current = this.text[i];
			} else {
				current = [this.text[i]];
			}
			for (let j = 0; j < current.length; j++) {
				if (this.shrink2fit) {
					ctx.fillText(current[j], x, y, this.size.x);
				} else {
					ctx.fillText(current[j], x, y);
				}
				y += lineheight;

				if (this.textboxstyle) {
					if (y < -Math.abs(lineheight) || y > this.size.y + Math.abs(lineheight))
						break drawloop;
				}
			}
		}
	}
}