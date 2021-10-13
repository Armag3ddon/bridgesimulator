import Fonts from '../definition/fonts.js';

export default {
	fontDefinitions: [],

	add(fontDefinitions) {
		this.fontDefinitions = fontDefinitions;
	},

	async load() {
		for (const font in this.fontDefinitions) {
			for (const style in this.fontDefinitions[font]) {
				let styleDefinition = { style: 'normal', weight: 'normal' };
				if (style == 'bold') {
					styleDefinition.weight = 'bold';
				}
				if (style == 'italtic') {
					styleDefinition.style = 'italic';
				}
				if (style == 'bolditalic') {
					styleDefinition.weight = 'bold';
					styleDefinition.style = 'italic';
				}
				const newFont = new FontFace(font,
					'url(./static/fonts/' + this.fontDefinitions[font][style].file + ')',
					styleDefinition);
				await newFont.load();
				document.fonts.add(newFont);
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