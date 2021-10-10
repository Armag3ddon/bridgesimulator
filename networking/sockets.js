/* Socket management */

const Socket = require('./socket.js');

class Sockets {
	constructor(io, engine) {
		this.io = io;
		this.parent = engine;

		this.sockets = [];
		this.reservations =[];
		io.on('connection', this.onConnection.bind(this));
	}

	reserveNetworkHandle(handle, handler) {
		this.reservations.push({ handler: handler, handle: handle });

		for (let i = 0; i < this.sockets.length; i++) {
			this.sockets[i].registerNetworkHandle(handle, handler);
		}
	}

	onConnection(socket) {
		const newSocket = new Socket(socket, this);
		this.sockets.push(newSocket);
		this.parent.onConnection(newSocket);

		for (let i = 0; i < this.reservations.length; i++) {
			newSocket.registerNetworkHandle(this.reservations[i].handle, this.reservations[i].handler);
		}
	}

	onDisconnection(socket) {
		this.sockets.splice(this.sockets.indexOf(socket), 1);
	}
}

module.exports = Sockets;