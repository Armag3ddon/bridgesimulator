/* Store all the information about an invidual player */

const i18next = require('i18next');
const PlayerNames = require('../scenarios/playernames.js');

class Player {
	constructor(id, socket, players) {
		this.id = id;
		this.parent = players;
		this.name = PlayerNames[Math.floor(PlayerNames.length * Math.random())];
		// Each player gets one socket object assigned
		this.socket = socket;

		this.authenticated = false;
		this.admin = false;
		this.language = this.parent.parent.default_language;

		console.info(i18next.t('game.player.connect', { id: id }));

		socket.registerNetworkHandle('passwordNeeded', this);
		socket.registerNetworkHandle('passwordCheck', this);
		socket.registerNetworkHandle('requestLanguages', this);
		socket.registerNetworkHandle('i18next', this);
		socket.registerNetworkHandle('getPlayerName', this);
	}

	getPlayerName() {
		this.socket.networkOut('getPlayerName', this.name);
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

	requestLanguages(callback) {
		callback({ all: this.parent.parent.languages, default: this.parent.parent.default_language });
	}

	i18next(data, callback) {
		let response = 'Translation error.';
		let keys = { lng: this.language };
		let request = data;

		// Use JSON to pass along keys as such:
		// { request: '', keys: { ... } }
		if (Object.prototype.toString.call(data) === '[object Object]') {
			if (!data.request)
				return callback(response);
			request = `${data.request}`;
			if (Object.prototype.toString.call(data.keys) !== '[object Object]')
				return callback(response);
			keys.request = data.keys;
		}
		if (Object.prototype.toString.call(request) == '[object String]') {
			response = i18next.t(request, keys);
		}
		if (Array.isArray(request)) {
			response = [];
			for (let i = 0; i < request.length; i++) {
				response.push(i18next.t(request[i], keys));
			}
		}
		callback(response);
	}
}

module.exports = Player;