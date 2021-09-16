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
		const passwordName = this.socket.sanitizeInput(data, { "user": "server_password", "admin": "admin_password" });
		if (passwordName == null) {
			this.socket.networkOut('passwordCheck', false);	
			return;
		}
		// Check whether a password is set in the config
		const password = this.parent.parent.config.getConfig(passwordName);
		if (password == '') {
			this.socket.networkOut('passwordNeeded', false);
			return;
		}
		this.socket.networkOut('passwordNeeded', true);
	}

	passwordCheck(data) {
		if (!data.value && !data.password) return;

		const passwordName = this.socket.sanitizeInput(data.password, { "user": "server_password", "admin": "admin_password" });
		if (passwordName == null) {
			this.socket.networkOut('passwordCheck', false);	
			return;
		}
		const value = `${data.value}`;
		const password = this.parent.parent.config.getConfig(passwordName);
		if (value == password) {
			this.elevatePrivileges(passwordName);
			this.socket.networkOut('passwordCheck', true);
		} else {
			this.socket.networkOut('passwordCheck', false);
		}
	}

	elevatePrivileges(password) {
		if (password == 'server_password')
			this.authenticated = true;
		if (password == 'admin_password')
			this.admin = true;
	}
}

module.exports = Player;