/* Store all the information on scenes. These will usually be passed
 * along to the director on the client side */

const fs = require('fs');
const path = require('path');
const i18next = require('i18next');

class Producer {
	constructor(engine, sockets) {
		this.parent = engine;
		this.basic_scenes = [];
		this.graphics = [];
		this.fonts = {};
		this.scenarios = [];

		sockets.reserveNetworkHandle('requestGraphics', this);
		sockets.reserveNetworkHandle('requestFonts', this);
		sockets.reserveNetworkHandle('requestColors', this);
		sockets.reserveNetworkHandle('requestBasicScenes', this);
	}

	loadGraphics() {
		const static_directory = this.parent.config.getConfig('static_directory');
		this.graphics = this.readGraphicsDirectory(static_directory + '/img');

		if (this.graphics.length == 0) {
			console.warn(i18next.t('server.warnings.no_graphics'));
		} else {
			console.info(i18next.t('server.engine.graphics_loaded',
				{ count: this.graphics.length }));
		}
	}

	loadColors() {
		try {
			this.colors = this.parent.loader.loadJSON('colors');
			console.info(i18next.t('server.engine.colors_loaded'));
		} catch {
			console.error(i18next.t('server.errors.failed_colors'));
		}
	}

	loadFonts() {
		try {
			this.fonts = this.parent.loader.loadJSON('fonts');
			if (Object.keys(this.fonts).length == 0) {
				console.warn(i18next.t('server.warnings.no_fonts'));
			} else {
				console.info(i18next.t('server.engine.fonts_loaded',
					{ count: Object.keys(this.fonts.files).length }));
			}
		} catch {
			console.error(i18next.t('server.errors.failed_fonts'));
		}
	}

	loadBasicScenes() {
		try {
			// PasswordScene
			const password = this.parent.loader.loadJSON('passwordscene');
			this.basic_scenes.push(password);
			// MenuScene
			const menu = this.parent.loader.loadJSON('mainmenu');
			this.basic_scenes.push(menu);
			// OptionsScene
			const options = this.parent.loader.loadJSON('optionsscene');
			this.basic_scenes.push(options);
			// SercerScene
			const server = this.parent.loader.loadJSON('serverscene');
			this.basic_scenes.push(server);

			console.info(i18next.t('server.engine.basic_scenes'));
		} catch {
			console.error(i18next.t('server.errors.failed_scenes'));
		}
	}

	loadScenarios() {
		const scenario_directory = this.parent.config.getConfig('scenario_directory');
		const dir_path = path.join(__dirname, '..', scenario_directory);
		const readout = fs.readdirSync(dir_path);
		for (let i = 0; i < readout.length; i++) {
			if (fs.lstatSync(path.join(dir_path, readout[i])).isDirectory()) {
				console.info(i18next.t('server.engine.load_scenario', { directory: readout[i] }));
				try {
					const scenario = JSON.parse(
						fs.readFileSync(
							path.resolve(
								dir_path,
								readout[i],
								'scenario.json')));
					this.scenarios.push(scenario);
				} catch {
					console.error(i18next.t(
						'server.errors.failed_scenario',
						{ directory: readout[i] }));
				}
			}
		}
	}

	requestGraphics(callback) {
		callback(this.graphics);
	}

	requestFonts(callback) {
		callback(this.fonts);
	}

	requestBasicScenes(data, callback) {
		callback(this.basic_scenes);
	}

	requestColors(data, callback) {
		callback(this.colors);
	}

	readGraphicsDirectory(directory) {
		const dir_path = path.join(__dirname, '..', directory);
		let files = [];
		try {
			const readout = fs.readdirSync(dir_path);
			for (let i = 0; i < readout.length; i++) {
				if (fs.lstatSync(path.join(dir_path, readout[i])).isDirectory()) {
					const deeper = this.readDirectory(directory + '/' + readout[i]);
					files = files.concat(deeper);
				} else {
					files.push(directory + '/' + readout[i]);
				}
			}
		} catch (error) {
			console.error(i18next.t('server.errors.failed_graphics', { filepath: dir_path })
				+ '\n'
				+ error);
		}
		return files;
	}
}

module.exports = Producer;