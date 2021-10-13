/* Server client game core */

const Sockets = require('./networking/sockets.js');
const Players = require('./networking/players.js');
const Producer =require('./networking/producer.js');
const JSONLoader = require('./internal/jsonloader.js');
const i18next = require('i18next');

class Engine {
	constructor(io, configuration, languages, server_language) {
		this.io = io;
		this.config = configuration;
		this.languages = languages;
		this.default_language = server_language;

		this.sockets = new Sockets(io, this);
		this.players = new Players(this);
		this.loader = new JSONLoader(
			configuration.getConfig('core_directory'),
			configuration.getConfig('custom_directory')
		);
		this.producer = new Producer(this, this.sockets, this.loader);
	}

	run() {
		console.info(i18next.t('server.engine.starting'));

		this.producer.loadGraphics();
		this.producer.loadFonts();
		this.producer.loadBasicScenes();

		console.info(i18next.t('server.engine.started'));
	}

	// Create a new player upon connection. Socket is an instance of networking/socket
	onConnection(socket) {
		this.players.newPlayer(socket);
	}
}

module.exports = Engine;