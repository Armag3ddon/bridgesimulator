import GameCore from './gamecore.js';
import graphic from './basic/graphic.js';
import fonts from './basic/fonts.js';
import config from './basic/config.js';

window.onload = async () => {
	// basic graphics
	graphic.add('/static/img/RegularButton.jpg');

	// fonts
	fonts.add('EdgeOfTheGalaxy', './static/fonts/EdgeOfTheGalaxyRegular.otf', { style: 'normal', weight: 'normal', stretch: 'extra-expanded' });
	fonts.add('FeelsLikeNostalgia', './static/fonts/FeelsLikeNostalgiaRegular.ttf', { style: 'normal', weight: 'normal' });
	fonts.add('SeverSansBook', './static/fonts/SeverSansBook.ttf', { style: 'normal', weight: 'normal' });
	fonts.add('SeverSansBook', './static/fonts/SeverSansBold.ttf', { style: 'normal', weight: 'bold' });
	fonts.add('SeverSansBook', './static/fonts/SeverSansBookItalic.ttf', { style: 'italic', weight: 'normal' });
	fonts.add('SeverSansBook', './static/fonts/SeverSansBoldItalic.ttf', { style: 'italic', weight: 'bold' });
	fonts.add('Astonish', './static/fonts/AstonishRegular.ttf', { style: 'normal', weight: 'normal' });
	fonts.add('SevenPxbus', './static/fonts/7Pxbus.ttf', { style: 'normal', weight: 'normal' });
	fonts.add('Schwachsinn', './static/fonts/SchwachsinnRegular.ttf', { style: 'normal', weight: 'normal' });
	await fonts.load();

	// preload graphics
	graphic.loadAll(() => {
		// Hide loading message
		document.getElementById('loading').style.display = 'none';
		// Start the client game
		const game = new GameCore(config);
		game.startup();
	});
};