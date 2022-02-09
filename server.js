// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const i18next = require('i18next');
const i18nexthttpbackend = require('i18next-http-backend');
const fs = require('fs');

const Engine = require('./engine.js');
const Config = require('./internal/config.js');

// Create important objects
const app = express();
const server = http.Server(app);
const io = socketIO(server);
const configuration = new Config();

// Server settings
const port = configuration.getConfig('server_port');
const dir = configuration.getConfig('static_directory');
const language_dir = configuration.getConfig('language_directory');
const pug_dir = configuration.getConfig('pug_directory');
const default_language = configuration.getConfig('server_language');
app.set('port', port);
app.set('view engine', 'pug');
app.set(pug_dir, path.join(__dirname, pug_dir));
app.use(dir, express.static(__dirname + dir));
app.use(language_dir, express.static(__dirname + language_dir));

// Routing
app.get('/', function(request, response) {
	response.render('index', { language: default_language, title: i18next.t('game.title'), loading: i18next.t('misc.loading') });
});
app.get(language_dir, function(request, response) {
	response.sendFile(path.join(__dirname, language_dir));
});

// Detect available languages
let languages_available = [];
if (configuration.getConfig('autodetect_languages')) {
	languages_available = fs.readdirSync(path.join(__dirname, language_dir)).filter((file) => {
		return fs.lstatSync(path.join(__dirname, language_dir, file)).isDirectory();
	});
} else {
	languages_available = configuration.getConfig('languages_available');
}

// Start the server.
server.listen(port, () => {
	// Start the i18n backend
	i18next.use(i18nexthttpbackend).init({
		lng: default_language,
		fallbackLng: 'en',
		preload: ['en', default_language],
		ns: ['main', 'glossary'],
		defaultNS: ['main'],
		backend: {
			loadPath: `http://localhost:${port}${language_dir}/{{lng}}/{{ns}}.json`
		}
	}, (err) => {
		if (err) return console.error('There was a problem starting the language module (i18next): ' + err);

		console.info(i18next.t('server.start', { port: port }));

		// Start the game engine
		const engine = new Engine(io, configuration, languages_available, default_language);
		engine.run();
	});
});