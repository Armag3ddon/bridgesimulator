import GameCore from './gamecore.js';
import graphic from './basic/graphic.js';
import fonts from './basic/fonts.js';
import config from './basic/config.js';

window.onload = async () => {
	const socket = io(); // eslint-disable-line no-undef

	socket.on('connect', () => {
		// Get all graphics to load from the server
		socket.emit('requestGraphics', async (graphics) => {
			graphic.add(graphics);
			// Get all fonts to load from the server
			socket.emit('requestFonts', async (fontDefinitions) => {
				fonts.add(fontDefinitions);
				// Preload fonts
				await fonts.load();
				// Preload graphics
				graphic.loadAll(() => {
					// Hide loading message
					document.getElementById('loading').style.display = 'none';
					// Start the client game
					window.gamecore = new GameCore(config, socket);
					window.gamecore.startup();
				});
			});
		});
	});
};