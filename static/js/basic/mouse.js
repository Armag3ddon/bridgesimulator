import {Zero} from './../geo/v2.js';

const mouse = Zero();
var game;

mouse.init = function (g) {
	const self = this;
	const gameframe = window.gameframe;
	let primaryTouchId = null;
	game = g;

	const getPrimaryTouch = touches => {
		for (let i = 0, j = touches.length; i < j; i++) {
			if (touches[i].identifier == primaryTouchId) {
				return touches[i];
			}
		}

		return null;
	};

	gameframe.onmousemove = ev => {
		self.x = ( ev.clientX - gameframe.offsetLeft );
		self.y = ( ev.clientY - gameframe.offsetTop );
	};

	gameframe.onclick = () => {
		if (game && game.scene && game.scene.click)
			game.scene.click(self);
	};

	gameframe.onmousedown = () => {
		if (game && game.scene && game.scene.mousedown)
			game.scene.mousedown(self);
	};

	gameframe.onmouseup = () => {
		if (game && game.scene && game.scene.mouseup)
			game.scene.mouseup(self);
	};

	/* Support for mobile devices */
	gameframe.ontouchstart = ev => {
		ev.preventDefault();
		if (primaryTouchId != null) return;

		this.onmousemove(ev.touches[0]);
		this.onmousedown(ev.touches[0]);
		primaryTouchId = ev.changedTouches[0].identifier;
	};

	gameframe.ontouchmove = ev => {
		const touch = getPrimaryTouch(ev.touches);
		ev.preventDefault();

		if (touch == null) return;
		this.onmousemove(touch);
	};

	gameframe.ontouchend = ev => {
		const touch = getPrimaryTouch(ev.changedTouches);
		ev.preventDefault();
		if (touch == null) return;

		this.onmouseup(touch);
		this.onclick(touch);
		primaryTouchId = null;

		self.x = -1;
		self.y = -1;
	};

	/* Support for mouse leaving the game */
	gameframe.onmouseout = ev => {
		gameframe.onmouseup(ev);
	};

};

export default mouse;