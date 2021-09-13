/* Store all the information about an invidual player */

class Player {
	constructor(id, socket) {
		this.id = id;
		// Each player gets one socket object assigned
		this.socket = socket;

		this.authentiacted = false;
		this.admin = false;

		console.log(`New player (${id}) created.`);
	}
}

module.exports = Player;