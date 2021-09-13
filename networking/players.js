/* Basic player handling */

const Player = require('./player.js');

class Players {
	constructor(engine) {
		this.playerCount = 0;
		this.nextPlayerID = 0;
		this.players = [];
		this.parent = engine;
	}

	newPlayer(socket) {
		const id = this.getNextPlayerID();
		const newPlayer = new Player(id, socket, this);
		this.players.push(newPlayer);
		return newPlayer;
	}

	getNextPlayerID() {
		const id = this.nextPlayerID;
		this.nextPlayerID++;
		return id;
	}
}

module.exports = Players;