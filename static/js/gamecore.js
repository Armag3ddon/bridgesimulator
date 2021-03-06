/* The canvas related code is heavily adapted from the tin-engine
see https://github.com/MasterIV/tin-engine/
provided under the

MIT License

Copyright (c) 2018 Tobias Rojahn
Copyright (c) 2021 Felix Wagner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import V2 from './geo/v2.js';
import mouse from './basic/mouse.js';
import ErrorScene from './entities/errorscene.js';
import Director from './basic/director.js';
import Painter from './basic/painter.js';

import TestScene from './entities/testscene.js';

window.requestAnimFrame = ((() =>
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	((callback) => { window.setTimeout(callback, 25); })
))();

export default class GameCore {
	constructor(config, socket, fonts) {
		this.size = new V2(
			window.innerWidth,
			window.innerHeight - document.getElementById('ui').offsetHeight);

		this.display = document.getElementById('gameframe');

		this.display.width = this.size.x;
		this.display.height = this.size.y;

		this.displayCtx = this.display.getContext('2d', config.contextAttributes);

		this.buffer = document.createElement('canvas');
		this.bufferCtx = this.buffer.getContext('2d', config.contextAttributes);
		this.buffer.width = this.size.x;
		this.buffer.height = this.size.y;

		this.fps = 1;
		this.frames = 0;

		this.loop = this.loop.bind(this);
		this.socket = socket;

		this.socket.on('getPlayerName', this.playerName.bind(this));
		this.socket.on('gamestate', this.networkIn.bind(this));
		this.socket.on('disconnect', this.networkError.bind(this));

		this.socket.onAny((event, data) => {
			console.log(event + ' @ ' + data);
		});

		this.director = new Director(this);
		this.painter = new Painter(this);
		this.fonts = fonts;
		this.scenes = [];
		this.scene = null;
	}

	startup() {
		this.fonts.fitFontSizes(window.screen.height);
		mouse.init(this);

		this.loadLanguages(() => {
			this.painter.loadColors();
		});
	}

	startupFinished() {
		window.onresize = this.resize.bind(this);
		this.fonts.applyFontColor(this.painter.defaultTextColor);

		this.networkOut('getPlayerName');

		this.addScene(new ErrorScene());
		this.addScene(new TestScene());

		setInterval(this.updateFramerate.bind(this), 1000);
		this.run();

		this.scenes['PasswordScene'].setPasswordName('user');
		this.scenes['PasswordScene'].setBack2Scene('MenuScene');
		this.goto('MenuScene');
	}

	loadLanguages(callback) {
		var self = this;
		this.socket.emit('requestLanguages', (response) => {
			self.languages_available = response.all;
			self.current_language = response.default;
			callback();
		});
	}

	loadBasicScenes(callback) {
		var self = this;
		this.socket.emit('requestBasicScenes', (response) => {
			for (let i = 0; i < response.length; i++) {
				self.director.constructScene(response[i]);
			}
			callback();
		});
	}

	addScene(scene) {
		this.scenes[scene.getName()] = scene;
		scene.setSize(this.size.x, this.size.y);
		scene.setParent(this);
		if (scene.onAdded)
			scene.onAdded();
	}

	removeScene(sceneName) {
		if (this.scenes[sceneName])
			this.scenes[sceneName] = null;
	}

	goto(sceneName) {
		if (this.scenes[sceneName]) {
			if (this.scene && this.scene.onLeave)
				this.scene.onLeave();
			this.scene = this.scenes[sceneName];
			if (this.scene.onGoto)
				this.scene.onGoto();
		}
	}

	run() {
		this.lastUpdate = Date.now();
		this.loop();
	}

	resize() {
		this.size.x = window.innerWidth;
		this.size.y = window.innerHeight - document.getElementById('ui').offsetHeight;

		this.display.width = this.size.x;
		this.display.height = this.size.y;
		this.buffer.width = this.size.x;
		this.buffer.height = this.size.y;

		this.broadcast('resize', this);
	}

	updateFramerate() {
		this.fps = this.frames;
		this.frames = 0;
	}

	loop() {
		const now = Date.now();
		const delta = now - this.lastUpdate;

		if (delta < 250 && this.scene) {
			this.update(delta);
			this.draw();
		}

		this.lastUpdate = now;
		this.frames++;

		window.requestAnimFrame(() => this.loop());
	}

	update(delta) {
		this.scene.update(delta);
	}

	draw() {
		this.scene.draw(this.bufferCtx);

		this.displayCtx.drawImage(this.buffer, 0, 0, this.size.x, this.size.y);
	}

	broadcast(callback, data) {
		for (const scene in this.scenes) {
			if (this.scenes[scene] && this.scenes[scene][callback]) {
				this.scenes[scene][callback](data);
			}
		}
	}

	networkIn(data) {
		console.log(data);
	}

	networkOut(handle, data, callback) {
		this.socket.emit(handle, data, callback);
	}

	networkError() {
		this.goto('ErrorScene');
	}

	playerName(name) {
		this.name = `${name}`;
		this.broadcast('playerName', this.name);
	}

	// Request one or more localised strings from the server
	// keys can either be a single string or an array of strings,
	// corresponding to the i18next notation
	geti18n(keys, callback) {
		this.socket.emit('i18next', keys, (response) => {
			callback(response);
		});
	}

	// Any entity can request to receive network updates
	registerNetworkHandle(handle, handler) {
		this.socket.on(handle, (data) => { handler.networkIn(handle, data); });
	}
}