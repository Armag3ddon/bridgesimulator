import Fonts from '../definition/fonts.js';

export default {
	fonts: [],

	add(name, url) {
		this.fonts.push({ name: name, url: url });
	},

	async load() {
		while( this.fonts.length ) {
			const font = this.fonts.shift();
			if( typeof this[font.name] == 'undefined' ) {
				this[font.name] = new FontFace(font.name, `url(${font.url})`);
				this[font.name].src = font.url;
				await this[font.name].load();
				document.fonts.add(this[font.name]);
			}
		}
	},

	fitFontSizes(screenheight) {
		const scale = screenheight / Fonts.fixedResolution;
		for (const font in Fonts) {
			if (Fonts[font].in1080) {
				Fonts[font].size = Math.round(Fonts[font].in1080 * scale);
			}
		}
	},

	applyFontColor(color) {
		for (const font in Fonts) {
			if (Fonts[font].in1080) {
				Fonts[font].fillStyle = color;
			}
		}
	},

	apply(ctx, definition) {
		ctx.textAlign = definition.textAlign ? definition.textAlign : 'left';
		ctx.textBaseline = definition.textBaseline ? definition.textBaseline : 'top';
		ctx.fillStyle = definition.fillStyle ? definition.fillStyle : 'white';
		const style = definition.style ? definition.style : 'normal';
		const variant = definition.variant ? definition.variant : 'normal';
		const weight = definition.weight ? definition.weight : 'normal';
		const size = definition.size ? definition.size : '12';
		const family = definition.family ? definition.family : 'sans-serif';
		ctx.font = `${style} ${variant} ${weight} ${size}px ${family}`;
	}
};