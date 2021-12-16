import Entity from './entity.js';

/** @module ResponsiveLayout */
export default class ResponsiveLayout extends Entity {
	/** 
	 * The core layouting entity. This will arrange all sub-entities according to certain rules, fitting them best into the screen area.
	 * Sub-entities can be sorted into rows but a row can get stacked vertically on narrow screens.
	 * @extends Entity
	 */
	constructor() {
		super();

		// First element of rows is used to store layouting information on all rows
		this.rows = [[null]];
		// If true, the layout will fit to its parent's size
		this.inheritSize = true;
	}

	async onDynamic(json, sceneHandles) {
		for (const row in json.rows) {
			let newRow = this.createRow(parseInt(row));
			for (const entity in json.rows[row]) {
				let newModule = entity.toLowerCase();
				if (newModule.includes('_')) {
					newModule = newModule.substr(0, newModule.indexOf('_'));
				}
				const module = await import('./' + newModule + '.js');
				const newEntity = await module.default.create(json.rows[row][entity], sceneHandles);

				if (json.rows[row][entity].width)
					this.setEntityWidth(newEntity, json.rows[row][entity].width);
				if (json.rows[row][entity].min_width)
					this.setEntityMinWidth(newEntity, json.rows[row][entity].min_width);
				if (json.rows[row][entity].height)
					this.setEntityHeight(newEntity, json.rows[row][entity].height);
				if (json.rows[row][entity].min_height)
					this.setEntityMinHeight(newEntity, json.rows[row][entity].min_height);
				if (json.rows[row][entity].vertical_spacer)
					this.setEntityVerticalSpacer(newEntity);
				if (json.rows[row][entity].horizontal_spacer)
					this.setEntityHorizontalSpacer(newEntity);

				this.add2Row(newEntity, newRow);
				if (newEntity.postDynamic) {
					await newEntity.postDynamic(json.rows[row][entity], sceneHandles);
				}
			}
		}
		if (json.fixedSize) this.setFixedSize();
	}

	postDynamic() {
		this.resize();
	}

	setFixedSize() {
		this.inheritSize = false;
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
		entity._RL_minwidth = this.parseLength(width);

		return this;
	}

	setEntityMinHeight(entity, height) {
		entity._RL_minheight = this.parseLength(height);

		return this;
	}

	setEntityHorizontalSpacer(entity) {
		entity._RL_hspacer = true;
	}

	setEntityVerticalSpacer(entity) {
		entity._RL_vspacer = true;
	}
	
	parseLength(value) {
		if (Number.isInteger(value)) return value;
		if (typeof value === 'string') {
			if (!isNaN(parseInt(value))) return parseInt(value);
			if (value.substr(0, 5) == 'fonts') {
				const fontname = value.slice(6);
				return parseInt(window.gamecore.fonts[fontname].size);
			}
		}
		return 0;
	}

	onResize() {
		if (this.inheritSize) {
			this.size = this.parent.size.clone();
		}

		let rowlength, rowminlength, flexibles, flexiblereduction, marginleft, marginright, vstack = false;
		let rowheight, allheight = 0, redoheight;
		let x;
		for (let i = 1; i < this.rows.length; i++) {
			rowlength = this.calculateRowWidth(i);
			rowminlength = this.calculateRowMinWidth(i);
			flexiblereduction = 0;
			flexibles = [];

			// The combined minimum sizes of all entities exceed the maximum length.
			if (rowminlength > this.size.x) {
				// This will stack entities on top of each other, treating each as their own row.
				// Entities that are marked as vertical spacer will be discarded entirely.
				// However, if this stacking exceeds the maximum height, redoheight will be set to
				// trigger reshuffling methods.
				vstack = true;
			} else if(rowlength > this.size.x) {
				// The combined sizes of all entities currently exceeds the maximum length.
				// flexiblereduction will set to be number of pixels that must be reduced. When
				// assigning sizes, the reduction will be applied as evenly as possible (with
				// respect to minWidth). flexibles will hold the indices of entities that can be
				// reduced in size.
				vstack = false;
				flexiblereduction = rowlength - this.size.x;
				this.rows[i].forEach((entity, index) => {
					if (this.getEntityShrinkable(entity))
						flexibles.push(index);
					entity._RL_flexiblereduction = 0;
				}, this);
				// Pre-Pre-Assign a reduction value to each entity in the row until all leftover
				// space is gone. > 1 to account for pixel rounding.
				while (flexiblereduction > 1) {
					const reductionperentity = Math.floor(flexiblereduction / flexibles.length);
					for (let j = 0; j < this.rows[i].length; j++) {
						if (flexibles.includes(j)) {
							const reduction = this.calculateEntityShrink(
								this.rows[i][j], reductionperentity
							);
							this.rows[i][j]._RL_flexiblereduction += reduction;
							flexiblereduction -= reduction;
							// If this entities has been shrunk down to minwidth, do no longer count
							// it as shrinkable
							if (reduction < reductionperentity) {
								flexibles.splice(flexibles.indexOf(j));
							}
						}
					}
				}
			} else {
				// Nothing needs to be done, all entities fit
				vstack = false;
			}
			this.rows[0][i].vstack = vstack;

			rowheight = this.calculateRowHeight(i);

			x = 0;
			// Pre-Assign the dimensions
			for (let j = 0; j < this.rows[i].length; j++) {
				// If stacking entities vertically, ignore spacers
				if (vstack && this.rows[i][j]._RL_vspacer) {
					this.rows[i][j]._RL_newsizex = 0;
					this.rows[i][j]._RL_newsizey = 0;
				} else {
					this.rows[i][j]._RL_newsizex = this.calculateEntityWidth(this.rows[i][j]);
					if (this.rows[i][j]._RL_flexiblereduction) {
						this.rows[i][j]._RL_newsizex -= this.rows[i][j]._RL_flexiblereduction;
					}
					this.rows[i][j]._RL_newsizey = this.calculateEntityHeight(this.rows[i][j]);
				}

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
				this.rows[i][j]._RL_flexiblereduction = null;
				this.rows[i][j]._RL_newsizey = null;
				this.rows[i][j]._RL_newx = null;
				this.rows[i][j]._RL_newy = null;
			}
		}
	}

	// Get the combined size of all entities in a given row, given our current dimensions.
	calculateRowWidth(row) {
		let width = 0;
		for (let i = 0; i < this.rows[row].length; i++) {
			width += this.calculateEntityWidth(this.rows[row][i]);
		}
		return width;
	}

	// Check just how much space all entities with minimum widths take up. Every entity without a
	// MinWidth setting is treated as a space that can go down to nothing.
	calculateRowMinWidth(row) {
		let minwidth = 0;
		for (let i = 0; i < this.rows[row].length; i++) {
			minwidth += this.rows[row][i]._RL_minwidth || 0;
		}
		return minwidth;
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

	// Get how many pixels this entity can be shrunk without violating mindwidth
	calculateEntityShrink(entity, amount) {
		let width = this.calculateEntityWidth(entity) - entity._RL_flexiblereduction;
		// Entity can be shrunk to 0
		if (!entity._RL_minwidth) {
			// Make sure that the entity doesn't get smaller than 0
			return Math.min(amount, width);
		}
		// Make sure that the entity doesn't get smaller than minwidth
		return Math.min(width - entity._RL_minwidth, amount);
	}

	// Check whether a given entity can be shrunk.
	getEntityShrinkable(entity) {
		if (!entity._RL_minwidth) {
			// No minwidth means the entity can be shrunk to 0.
			return true;
		}
		if (this.calculateEntityWidth(entity) > entity._RL_minwidth) {
			// Minwidth is not yet reached, entity can be shrunk further down
			return true;
		}
		return false;
	}

	calculateEntityHeight(entity) {
		return Math.floor(Math.max(this.size.y * (entity._RL_height || 0) / 100, entity._RL_minheight || 0));
	}
}