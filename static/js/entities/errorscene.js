/* This scene prompts the user for a password.
There are two possible passwords to be requested:
User access (get on the server) and administrator privileges */

import V2 from '../geo/v2.js';
import Scene from './scene.js';
import TextEntity from './textentity.js';
import fonts from '../definition/fonts.js';
import colors from '../definition/colors.js';
import RectEntity from './rectentity.js';
import AnimationRectUnfold from '../animations/rectunfold.js';

export default class ErrorScene extends Scene {
	constructor() {
		super('ErrorScene');
	}

	onAdded() {
		this.parent.registerNetworkHandle('reconnect', this);
		this.parent.registerNetworkHandle('reconnect_attempt', this);
		this.parent.registerNetworkHandle('reconnect_error', this);
		this.parent.registerNetworkHandle('reconnect_failed', this);

		const title = new TextEntity(new V2(this.parent.size.x/2, 65), 'Connection Lost', fonts.fancy_title);
		this.add(title);
		this.box = new RectEntity(new V2(this.parent.size.x/2 - 200, 130), new V2(400, 300), colors.textbox);
		this.messenger = new TextEntity(new V2(this.parent.size.x/2, 150), 'There was a problem with the connection to the server.', fonts.basic);
		this.add(this.box);
		this.add(this.messenger);
		const effect = new AnimationRectUnfold(2000, () => { this.messenger.visible = true; });
		this.box.add(effect);
		this.messenger.seti18nText('game.error.connection_lost');
		this.messenger.visible = false;
	}

	networkIn(handle, data) {
		console.log(handle + ' @ ' + data);
	}
}