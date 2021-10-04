/* This scene prompts the user for a password.
There are two possible passwords to be requested:
User access (get on the server) and administrator privileges */

import V2 from '../geo/v2.js';
import {Zero} from '../geo/v2.js';
import Scene from './scene.js';
import TextEntity from './textentity.js';
import DOMEntity from './domentity.js';
import RectEntity from './rectentity.js';
import ResponsiveLayout from './responsivelayout.js';
import Layout from './layout.js';
import Button from './button.js';
import fonts from '../definition/fonts.js';
import Colors from '../definition/colors.js';
import Entity from './entity.js';

export default class MenuScene extends Scene {
	constructor() {
		super('MenuScene');

		this.layout = new ResponsiveLayout(Zero(), this.size.clone());
		this.add(this.layout);
	}

	onAdded() {
		let row = this.layout.createRow();

		let spacer = new Entity();
		this.layout.add2Row(spacer, row)
		.setEntityWidth(spacer, 100)
		.setEntityMinHeight(spacer, 5);

		spacer = new Entity();
		this.layout.add2Row(spacer, row)
		.setEntityWidth(spacer, 5)
		.setEntityHeight(spacer, 5);

		this.hello = new TextEntity(Zero(), '', fonts.friendly);
		if (this.parent.name) {
			this.hello.seti18nText(this.parent, { request: 'game.menu.hello', keys: { name: this.parent.name } });
		}
		this.layout.add2Row(this.hello, row)
		.setEntityWidth(this.hello, 95)
		.setEntityHeight(this.hello, 5)
		.setEntityMinHeight(this.hello, fonts.friendly.size);

		row = this.layout.createRow();

		const textbox = new RectEntity(Zero(), Zero(), Colors.textbox);
		this.layout.add2Row(textbox, row)
		.setEntityWidth(textbox, 70)
		.setEntityMinWidth(textbox, 300)
		.setEntityHeight(textbox, 50)
		.setEntityMinHeight(textbox, 25);

		spacer = new Entity();
		this.layout.add2Row(spacer, row)
		.setEntityWidth(spacer, 5)
		.setEntityHeight(spacer, 50);

		const layout = new Layout(Zero(), Zero(), 'horizontal', 25, 50);
		this.layout.add2Row(layout, row)
		.setEntityWidth(layout, 25)
		.setEntityMinWidth(layout, 300)
		.setEntityHeight(layout, 50)
		.setEntityMinHeight(layout, 50);

		const button1 = Button.create(Zero(), () => {}).rectButton(Colors.button);
		layout.add(button1);

		this.resize(this.parent);
	}

	onGoto() {

	}

	networkIn(handle, data) {

	}

	playerName(name) {
		this.hello.seti18nText(this.parent, { request: 'game.menu.hello', keys: { name: name } });
	}
}