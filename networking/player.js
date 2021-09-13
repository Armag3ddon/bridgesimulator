/* Store all the information about an invidual player */

class Player {
	constructor(id, socket, players) {
		this.id = id;
		this.parent = players;
		// Each player gets one socket object assigned
		this.socket = socket;

		this.authenticated = false;
		this.admin = false;

		console.log(`New player (${id}) created.`);

		socket.registerNetworkHandle('passwordNeeded', this);
		socket.registerNetworkHandle('passwordCheck', this);
	}

	passwordNeeded(data) {
		// Sanitise input
		let passwordName = '';
		if (data) {
			if (data == 'user')
				passwordName = 'server_password';
			if (data == 'admin')
				passwordName = 'admin_password';
		}
		if (passwordName == '') {
			this.socket.networkOut('passwordCheck', false);	
			return;
		}
		// Check whether a password is set in the config
		const password = this.parent.parent.config.getConfig(passwordName);
		if (password == '') {
			this.socket.networkOut('passwordCheck', false);
			return;
		}
		this.socket.networkOut('passwordCheck', true);
	}
}

module.exports = Player;