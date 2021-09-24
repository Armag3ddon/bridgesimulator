import GameCore from './gamecore.js';
import PasswordScene from './entities/passwordscene.js';
import graphic from './basic/graphic.js';
import fonts from './basic/fonts.js';
import mouse from './basic/mouse.js';
import config from './basic/config.js';

window.onload = async () => {
	// fonts
	fonts.add('EdgeOfTheGalaxy', './static/fonts/EdgeOfTheGalaxyRegular.otf', { style: 'normal', weight: 'normal', stretch: 'extra-expanded' });
	fonts.add('FeelsLikeNostalgia', './static/fonts/FeelsLikeNostalgiaRegular.ttf', { style: 'normal', weight: 'normal' });
	fonts.add('SeverSansBook', './static/fonts/SeverSansBook.ttf', { style: 'normal', weight: 'normal' });
	fonts.add('SeverSansBook', './static/fonts/SeverSansBold.ttf', { style: 'normal', weight: 'bold' });
	fonts.add('SeverSansBook', './static/fonts/SeverSansBookItalic.ttf', { style: 'italic', weight: 'normal' });
	fonts.add('SeverSansBook', './static/fonts/SeverSansBoldItalic.ttf', { style: 'italic', weight: 'bold' });
	await fonts.load();

	// preload graphics
	graphic.load(() => {
		document.getElementById('loading').style.display = 'none';
		const game = new GameCore(config);
		mouse.init(game);
		game.run();
		game.loadLanguages(() => {
			const anotherscene = null;
			const passwordscene = new PasswordScene('user', anotherscene);
			passwordscene.setBackgroundColor('#111');
			game.addScene(passwordscene);
			game.goto('PasswordScene');
		});
	});
}