export default {
	fonts: [],

	add(name, url) {
		this.fonts.push({ name: name, url: url });
	},

	async load() {
		let total = 0, loaded = 0;

		while( this.fonts.length ) {
			const font = this.fonts.shift();
			if( typeof this[font.name] == 'undefined' ) {
				total++;
				this[font.name] = new FontFace(font.name, `url(${font.url})`);
				this[font.name].src = font.url;
				await this[font.name].load();
				document.fonts.add(this[font.name]);
			}
		}
	},

	apply(ctx, definition) {
		ctx.textAlign = definition.textAlign ? definition.textAlign : 'left';
		ctx.textBaseline = definition.textBaseline ? definition.textBaseline : 'middle';
		ctx.fillStyle = definition.fillStyle ? definition.fillStyle : 'black';
		const style = definition.style ? definition.style : 'normal';
		const variant = definition.variant ? definition.variant : 'normal';
		const weight = definition.weight ? definition.weight : 'normal';
		const size = definition.size ? definition.size : '12';
		const family = definition.family ? definition.family : 'sans-serif';
		ctx.font = `${style} ${variant} ${weight} ${size}px ${family}`;
	}
};