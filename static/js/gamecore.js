/* The canvas related code is heavily adapted from the tin-engine
see https://github.com/MasterIV/tin-engine/
provided under the

MIT License

Copyright (c) 2018 Tobias Rojahn

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

Copyright (c) 2021 Felix Wagner
*/

import V2 from './geo/v2.js';

window.requestAnimFrame = ((() =>
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	((callback) => { window.setTimeout(callback, 25); })
))();

export default class GameCore {
	constructor(config) {
		this.scale = 1;
		this.size = config.screen ? new V2(config.screen.w, config.screen.h) : new V2(800, 600);

		this.display = document.getElementById('gameframe');

		if (config.scale) {
			this.resize();
			window.onresize = this.resize.bind(this);
		} else {
			this.display.width = this.size.x;
			this.display.height = this.size.y;
		}

		this.displayCtx = this.display.getContext('2d', config.contextAttributes);

		this.buffer = document.createElement('canvas');
		this.buffer.style.letterSpacing = '5px';
		this.bufferCtx = this.buffer.getContext('2d', config.contextAttributes);
		this.buffer.width = this.size.x;
		this.buffer.height = this.size.y;

		this.fps = 1;
		this.frames = 0;
		setInterval(this.updateFramerate.bind(this), 1000);

		this.loop = this.loop.bind(this);
		this.socket = io();
		var self = this;
		this.socket.on('gamestate', (data) => { self.networkIn(data); });
		this.scenes = [];
		this.scene = null;
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
		if (this.scenes[sceneName])
			this.scene = this.scenes[sceneName];
	}

	run() {
		this.lastUpdate = Date.now();
		this.loop();
	}

	resize() {
		const fw = window.innerWidth / this.size.x;
		const fh = window.innerHeight / this.size.y;

		this.scale = Math.min(fw, fh);

		this.display.width = this.size.x * this.scale;
		this.display.height = this.size.y * this.scale;
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

		requestAnimFrame(() => this.loop());
	}

	update(delta) {
		this.scene.update(delta);
	}

	draw() {
		this.scene.draw(this.bufferCtx);

		this.displayCtx.drawImage(this.buffer, 0, 0, this.size.x * this.scale, this.size.y * this.scale);
	}

	networkIn(data) {
		console.log(data);
	}

	networkOut(handle, data, callback) {
		this.socket.emit(handle, data, callback);
	}

	// Any entity can request to receive network updates
	registerNetworkHandle(handle, handler) {
		this.socket.on(handle, (data) => { handler.networkIn(handle, data); });
	}
}