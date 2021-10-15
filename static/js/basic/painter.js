/* The painter saves the color schemes from the server */

import Colors from './colors.js';

export default class Painter {
	constructor(gamecore) {
		this.parent = gamecore;
	}

	loadColors() {
		this.parent.networkOut('requestColors', null, (colorSchemes) => {
			for (const color in colorSchemes) {
				// If JSON, create a Colors object
				if (Object.prototype.toString.call(colorSchemes[color]) === '[object Object]') {
					this[color] = new Colors(
						this.parseColor(colorSchemes[color].stroke),
						this.parseColor(colorSchemes[color].fill),
						this.parseColor(colorSchemes[color].hoverStroke),
						this.parseColor(colorSchemes[color].hoverFill));
				} else {
					// Otherwise just save the color
					this[color] = this.parseColor(colorSchemes[color]);
				}
			}

			this.parent.director.loadBasicScenes();
		});
	}

	parseColor(value) {
		if (!value) return null;
		if (value.substr(0, 2) == '--')
			return getComputedStyle(document.body).getPropertyValue(value);
		return value;
	}
}