// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const Engine = require('./engine.js');
const Config = require('./internal/config.js');

// Create important objects
const app = express();
const server = http.Server(app);
const io = socketIO(server);
const configuration = new Config();

// Server settings
const port = configuration.getConfig("server_port");
const dir = configuration.getConfig("static_directory");
app.set('port', port);
app.use(dir, express.static(__dirname + dir));

// Routing
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, dir + '/index.html'));
});

// Starts the server.
server.listen(port, function() {
	console.log(`Starting server on port ${port}`);
});

// Start the game engine
const engine = new Engine(io);