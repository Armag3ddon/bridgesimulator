/* This scene prompts the user for a password.
There are two possible passwords to be requested:
User access (get on the server) and administrator privileges */

import Scene from './scene.js';
import DOMEntity from './domentity.js';

export default class PasswordScene extends Scene {
	constructor() {
		super('PasswordScene');

		this.passwordName = null;
		this.back2Scene = null;
		this.waiting = true;
		this.passwordNeeded = true;
	}

	setPasswordName(name) {
		// Must be either 'user' or 'admin'
		this.passwordName = name;
	}

	setBack2Scene(sceneName) {
		this.back2Scene = sceneName;
	}

	onAdded() {
		this.parent.registerNetworkHandle('passwordNeeded', this);
		this.parent.registerNetworkHandle('passwordCheck', this);
	}

	onGoto() {
		if (!this.passwordName) return;
		this.active = true;

		this.parent.networkOut('passwordNeeded', this.passwordName);

		if (this.passwordName == 'user')
			this.messenger.seti18nText({ request: 'game.password.hello', keys: { site: document.location.origin } });
		if (this.passwordName == 'admin')
			this.messenger.seti18nText('game.password.admin');
	}

	onLeave() {
		this.reset();
	}

	networkIn(handle, data) {
		if (!this.active) return;

		if (handle == 'passwordNeeded') {
			this.waiting = false;
			if (!data) {
				this.passwordNeeded = false;
			} else {
				this.messenger.addi18nText('game.password.waiting');
			}
		}
		if (handle == 'passwordCheck') {
			if (data == true) {
				this.proceed();
			} else {
				this.messenger.addi18nText('game.password.incorrect');
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
		this.parent.networkOut('passwordCheck', { value: `${value}`, password: `${this.passwordName}` });
	}

	proceed() {
		this.parent.goto(this.back2Scene);
	}

	reset() {
		if (this.prompt)
			this.prompt.destroy();
		this.messenger.setText('');
		this.passwordName = null;
		this.back2Scene = null;
	}
}