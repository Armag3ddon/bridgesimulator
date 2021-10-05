import Entity from "./entity.js";

/** @module ResponsiveLayout */
export default class ResponsiveLayout extends Entity {
	/** 
	 * The core layouting entity. This will arrange all sub-entities according to certain rules, fitting them best into the screen area.
	 * Sub-entities can be sorted into rows but a row can get stacked vertically on narrow screens.
	 * @extends Entity
	 */
	constructor(position, size) {
		super(position, size);

		// First element of rows is used to store layouting information on all rows
		this.rows = [[null]];
	}

	/**
	 * Create a new row in the layout.
	 * @param {int} row - The row to create. Leave blank to just create a new one.
	 * @returns this
	 */
	createRow(row) {
		if (!row) row = this.rows.length;
		if (!this.rows[row]) {
			this.rows[row] = [];
			this.rows[0][row] = { halign: 'left', valign: 'top', vstack: false };
		}
		return row;
	}

	add2Row(entity, row) {
		this.createRow(row);

		this.rows[row].push(entity);
		this.add(entity);

		return this;
	}

	/**
	 * 
	 * @param {Entity} entity 
	 * @param {int} percentage 
	 * @returns 
	 */
	setEntityWidth(entity, percentage) {
		entity._RL_width = percentage;

		return this;
	}

	setEntityHeight(entity, percentage) {
		entity._RL_height = percentage;

		return this;
	}

	setEntityMinWidth(entity, width) {
		entity._RL_minwidth = width;

		return this;
	}

	setEntityMinHeight(entity, width) {
		entity._RL_minheight = width;

		return this;
	}

	onResize() {
		this.size = this.parent.size.clone();

		let rowlength, marginleft, marginright, vstack = false;
		let rowheight, allheight = 0, redoheight;
		let x;
		for (let i = 1; i < this.rows.length; i++) {
			rowlength = this.calculateRowWidth(i);

			if (rowlength > this.size.x) {
				// Try stacking entities on top of each other
				// if redoheight is true at the end, reshuffling might take place.
				// Each entity gets treated as a single row
				vstack = true;
			} else {
				vstack = false;
			}
			this.rows[0][i].vstack = vstack;
			rowheight = this.calculateRowHeight(i);

			x = 0;
			// Pre-Assign the dimensions
			for (let j = 0; j < this.rows[i].length; j++) {
				this.rows[i][j]._RL_newsizex = this.calculateEntityWidth(this.rows[i][j]);
				this.rows[i][j]._RL_newsizey = this.calculateEntityHeight(this.rows[i][j]);
				this.rows[i][j]._RL_newx = x;
				this.rows[i][j]._RL_newy = allheight;

				if (!vstack) {
					x += this.rows[i][j]._RL_newsizex;
				} else {
					allheight += this.rows[i][j]._RL_newsizey;
				}
			}

			if (!vstack) allheight += rowheight;
			if (allheight > this.size.y) redoheight = true;
		}

		this.doResize();
	}

	// Apply dimensions and positions to all entities
	doResize() {
		for (let i = 1; i < this.rows.length; i++) {
			for (let j = 0; j < this.rows[i].length; j++) {
				this.rows[i][j].size.x = this.rows[i][j]._RL_newsizex;
				this.rows[i][j].size.y = this.rows[i][j]._RL_newsizey;
				this.rows[i][j].position.x = this.rows[i][j]._RL_newx;
				this.rows[i][j].position.y = this.rows[i][j]._RL_newy;

				this.rows[i][j]._RL_newsizex = null;
				this.rows[i][j]._RL_newsizey = null;
				this.rows[i][j]._RL_newx = null;
				this.rows[i][j]._RL_newy = null;
			}
		}
	}

	// Get the combined size of all entities in a given row,
	// given our current dimensions.
	calculateRowWidth(row) {
		let width = 0;
		for (let i = 0; i < this.rows[row].length; i++) {
			width += this.calculateEntityWidth(this.rows[row][i]);
		}
		return width;
	}

	calculateRowHeight(row) {
		let height = 0, testheight;
		for (let i = 0; i < this.rows[row].length; i++) {
			testheight = this.calculateEntityHeight(this.rows[row][i]);
			if (testheight > height) {
				height = testheight;
			}
		}
		return height;
	}

	// Get the dimension of a given sub-entity
	calculateEntityWidth(entity) {
		return Math.floor(Math.max(this.size.x * (entity._RL_width || 0) / 100, entity._RL_minwidth || 0));
	}

	calculateEntityHeight(entity) {
		return Math.floor(Math.max(this.size.y * (entity._RL_height || 0) / 100, entity._RL_minheight || 0));
	}
}