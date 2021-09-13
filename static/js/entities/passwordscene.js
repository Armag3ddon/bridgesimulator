/* This scene prompts the user for a password.
There are two possible passwords to be requested:
User access (get on the server) and administrator privileges */

import Scene from './scene.js';

export default class PasswordScene extends Scene {
	constructor(passwordName, backTo) {
		super('PasswordScene');
		
		// Must be either 'user' or 'admin'
		this.passwordName = passwordName;
		this.backToScene = backTo;
	}

	onAdded() {
		this.parent.registerNetworkHandle('passwordNeeded', this);
		this.parent.registerNetworkHandle('passwordCheck', this);

		console.log('Sending check');
		this.parent.networkOut('passwordNeeded', this.passwordName);
	}

	networkIn(handle, data) {
		console.log("password request: " + handle + " " + data);
	}
}