/* This scene prompts the user for a password.
There are two possible passwords to be requested:
User access (get on the server) and administrator privileges */

import V2 from '../geo/v2.js';
import Scene from './scene.js';
import TextEntity from './text.js';
import DOMEntity from './domentity.js';
import fonts from '../definition/fonts.js';

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
	}

	onAdded() {
		this.parent.registerNetworkHandle('passwordNeeded', this);
		this.parent.registerNetworkHandle('passwordCheck', this);

		this.parent.networkOut('passwordNeeded', this.passwordName);

		const title = new TextEntity(new V2(this.parent.size.x/2, 65), 'T h e  B r i d g e', fonts.title);
		this.add(title);
		this.messenger = new TextEntity(new V2(this.parent.size.x/2, 150), '', fonts.small);
		this.add(this.messenger);
		this.messenger.seti18nText(this.parent, 'game.password.waiting');
	}

	onGoto() {
		this.active = true;
	}

	onLeave() {
		if (this.prompt)
			this.prompt.destroy();
		this.waiting = true;
		this.passwordNeeded = true;
		this.active = false;
	}

	networkIn(handle, data) {
		if (!this.active) return;

		if (handle == 'passwordNeeded') {
			this.waiting = false;
			if (!data)
				this.passwordNeeded = false;
		}
		if (handle == 'passwordCheck') {
			if (data == true)
				this.proceed();
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
		this.destroy();
	}
}