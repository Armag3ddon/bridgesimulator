/* Server client game core */

const Sockets = require('./networking/sockets.js');
const Players = require('./networking/players.js');

class Engine {
	constructor(io) {
		this.io = io;

		this.sockets = new Sockets(io, this);
		this.players = new Players();
	}

	// Create a new player upon connection. Socket is an instance of networking/socket
	onConnection(socket) {
		this.players.newPlayer(socket);
	}
}

module.exports = Engine;