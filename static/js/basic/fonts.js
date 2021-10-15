/* Holds all information on fonts */

export default class Font {
	constructor(fontFiles, fontDefinitions) {
		this.files = fontFiles;
		this.definitions = fontDefinitions;
		this.fixedResolution = 1080;
	}

	async loadFiles() {
		for (const font in this.files) {
			for (const style in this.files[font]) {
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
					'url(./static/fonts/' + this.files[font][style].file + ')',
					styleDefinition);
				await newFont.load();
				document.fonts.add(newFont);
			}
		}
	}

	defaultDefinition() {
		return {
			family: 'sans-serif',
			size: '14',
			weight: 'normal',
			variant: 'normal',
			style: 'normal',
			fillStyle: 'white',
			textBaseline: 'top',
			textAlign: 'left'
		};
	}

	loadDefinitions() {
		for (const definition in this.definitions) {
			// Apply defaults
			this[definition] = this.defaultDefinition();
			for (const attribute in this.definitions[definition]) {
				// Apply overrides
				this[definition][attribute] = this.definitions[definition][attribute];
			}
		}
	}

	fitFontSizes(screenheight) {
		const scale = screenheight / this.fixedResolution;
		for (const definition in this.definitions) {
			this[definition].size = Math.round(
				this[definition].size * scale
			);
		}
	}

	applyFontColor(color) {
		for (const definition in this.definitions) {
			this[definition].fillStyle = color;
		}
	}

	apply(ctx, definition) {
		ctx.textAlign = this[definition].textAlign;
		ctx.textBaseline = this[definition].textBaseline;
		ctx.fillStyle = this[definition].fillStyle;
		ctx.font = this[definition].style + ' '
			+ this[definition].variant + ' '
			+ this[definition].weight + ' '
			+ this[definition].size + 'px '
			+ this[definition].family + ' ';
	}
}