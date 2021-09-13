/* A single connection to a client */

class Socket {
	constructor(socket, sockets) {
		this.socket = socket;
		this.parent = sockets;

		var self = this;
		this.socket.on('disconnect', (reason) => { self.disconnect(reason); });

		console.log(`A new client with id ${socket.id} connected.`);
	}

	disconnect(reason) {
		console.log(`A client lost connection. Reason:\n${reason}`);

		this.parent.onDisconnection(this);
	}
}

module.exports = Socket;