import GameCore from './gamecore.js';
import PasswordScene from './entities/passwordscene.js';
import ErrorScene from './entities/errorscene.js';
import graphic from './basic/graphic.js';
import fonts from './basic/fonts.js';
import mouse from './basic/mouse.js';
import config from './basic/config.js';
import MenuScene from './entities/menuscene.js';

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
		document.getElementById('loading').style.display = 'none';
		const game = new GameCore(config);
		mouse.init(game);
		game.run();
		game.loadLanguages(() => {
			const menuscene = new MenuScene();
			const passwordscene = new PasswordScene('user', menuscene);
			const errorscene = new ErrorScene();
			game.addScene(passwordscene);
			game.addScene(errorscene);
			game.addScene(menuscene);
			game.goto('PasswordScene');
		});
	});
}