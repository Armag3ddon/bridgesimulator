/* This scene prompts the user for a password.
There are two possible passwords to be requested:
User access (get on the server) and administrator privileges */

import V2 from '../geo/v2.js';
import {Zero} from '../geo/v2.js';
import Scene from './scene.js';
import TextEntity from './text.js';
import DOMEntity from './domentity.js';
import RectEntity from './rectentity.js';
import ResponsiveLayout from './responsivelayout.js';
import fonts from '../definition/fonts.js';
import Colors from '../definition/colors.js';

export default class PasswordScene extends Scene {
	constructor(passwordName, backTo) {
		super('PasswordScene');

		// Must be either 'user' or 'admin'
		this.passwordName = passwordName;
		this.backToScene = backTo;

		this.waiting = true;
		this.passwordNeeded = true;
		this.active = false;

		this.messenger = null;

		this.layout = new ResponsiveLayout(Zero(), this.size.clone());
		this.add(this.layout);
	}

	onAdded() {
		this.parent.registerNetworkHandle('passwordNeeded', this);
		this.parent.registerNetworkHandle('passwordCheck', this);

		this.parent.networkOut('passwordNeeded', this.passwordName);

		// Title
		let row = this.layout.createRow();
		const title = new TextEntity(Zero(), 'T h e  B r i d g e', fonts.title);
		this.layout.add2Row(title, row)
		.setEntityWidth(title, 80)
		.setEntityMinWidth(title, 300)
		.setEntityMinHeight(title, parseInt(fonts.title.size));

		// Textbox
		row = this.layout.createRow();
		const textboxsize = Math.round(this.size.x * 0.8);
		const textbox = new RectEntity(Zero(), new V2(textboxsize, 300), Colors.textbox);
		this.layout.add2Row(textbox, row)
		.setEntityWidth(textbox, 80)
		.setEntityHeight(textbox, 60)
		.setEntityMinHeight(textbox, parseInt(fonts.small.size * 2));

		this.messenger = new TextEntity(Zero(), '', fonts.small);
		textbox.add(this.messenger);
		this.messenger.setMargin(5);
		this.messenger.setTextboxstyle();
		if (this.passwordName == 'user')
			this.messenger.seti18nText(this.parent, { request: 'game.password.hello', keys: { site: document.location.origin } });
		if (this.passwordName == 'admin')
			this.messenger.seti18nText(this.parent, 'game.password.admin');
	}

	onGoto() {
		this.active = true;
	}

	onLeave() {
		this.destroy();
	}

	networkIn(handle, data) {
		if (!this.active) return;

		if (handle == 'passwordNeeded') {
			this.waiting = false;
			if (!data) {
				this.passwordNeeded = false;
			} else {
				this.messenger.addi18nText(this.parent, 'game.password.waiting');
			}
		}
		if (handle == 'passwordCheck') {
			if (data == true) {
				this.proceed();
			} else {
				this.messenger.addi18nText(this.parent, 'game.password.incorrect');
			}
		}
	}

	onUpdate() {
		if (this.waiting) return;
		if (!this.passwordNeeded) return this.proceed();

		if (!this.prompt) {
			this.prompt = new DOMEntity('password');
			this.add(this.prompt);
		}		
	}

	onDOMEntityEnter(value) {
		this.parent.networkOut('passwordCheck', { value: `${value}`, password: this.passwordName });
	}

	proceed() {
		this.parent.goto(this.backToScene);
	}

	destroy() {
		if (this.prompt)
			this.prompt.destroy();
		super.destroy();
	}
}