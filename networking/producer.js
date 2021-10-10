/* Store all the information on scenes. These will usually be passed
 * along to the director on the client side */

class Producer {
	constructor(engine, sockets) {
		this.parent = engine;
		this.basic_scenes = [];
		
		sockets.reserveNetworkHandle('requestBasicScenes', this);
	}

	loadBasicScenes() {
		// MenuScene
		const menu = this.parent.loader.loadJSON('mainmenu');
		
		this.basic_scenes.push(menu);
	}

	requestBasicScenes(data, callback) {
		callback(this.basic_scenes);
	}
}

module.exports = Producer;