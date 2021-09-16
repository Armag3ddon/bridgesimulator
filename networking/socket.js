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

	registerNetworkHandle(handle, handler) {
		this.socket.on(handle, (data) => { handler[handle](data); });
	}

	networkOut(handle, data) {
		this.socket.emit(handle, data);
	}

	/* Check if the sent data contains a certain string value
	   expected can either be an array of valid values in which case the return value is any of the elements
	   or a JSON in the form of { 'valid_value': return_value }
	   will return null if data is not valid */
	sanitizeInput(data, expected) {
		const value = `${data}`;
		if (!value) return null;

		if (Array.isArray(expected)) {
			for (let i = 0; i < expected.length; i++) {
				if (expected[i] == value)
					return expected[i];
			}
		}
		if (Object.prototype.toString.call(expected) === '[object Object]') {
			if (expected[value])
				return expected[value];
		}
		return null;
	}
}

module.exports = Socket;