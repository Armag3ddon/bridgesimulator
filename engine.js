/* Server client game core */

const Sockets = require('./networking/sockets.js');
const Players = require('./networking/players.js');

class Engine {
	constructor(io, configuration, languages, server_language) {
		this.io = io;
		this.config = configuration;
		this.languages = languages;
		this.default_language = server_language;

		this.sockets = new Sockets(io, this);
		this.players = new Players(this);
	}

	// Create a new player upon connection. Socket is an instance of networking/socket
	onConnection(socket) {
		this.players.newPlayer(socket);
	}
}

module.exports = Engine;