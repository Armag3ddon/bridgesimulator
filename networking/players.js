/* Basic player handling */

const Player = require('./player.js');

class Players {
	constructor() {
		this.playerCount = 0;
		this.nextPlayerID = 0;
		this.players = [];
	}

	newPlayer(socket) {
		const id = this.getNextPlayerID();
		const newPlayer = new Player(id, socket);
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