/* Socket management */

const Socket = require('./socket.js');

class Sockets {
	constructor(io, engine) {
		this.io = io;
		this.parent = engine;

		this.sockets = [];
		var self = this;
		io.on('connection', (socket) => { self.onConnection(socket); });
	}

	onConnection(socket) {
		const newSocket = new Socket(socket, this);
		this.sockets.push(newSocket);
		this.parent.onConnection(newSocket);
	}

	onDisconnection(socket) {
		this.sockets.splice(this.sockets.indexOf(socket), 1);
	}
}

module.exports = Sockets;