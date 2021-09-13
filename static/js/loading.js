import GameCore from './gamecore.js';
import PasswordScene from './entities/passwordscene.js';
import graphic from './basic/graphic.js';
import mouse from './basic/mouse.js';
import config from './basic/config.js';

window.onload = () => {


	// preload graphics
	graphic.load(() => {
		document.getElementById('loading').style.display = 'none';
		const game = new GameCore(config);
		mouse.init(game);
		game.run();
		const anotherscene = null;
		const passwordscene = new PasswordScene('user', anotherscene);
		game.addScene(passwordscene);
		game.goto('PasswordScene');
	});
}