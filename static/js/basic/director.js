/* The director manages and constructs the scenes */

import Scene from '../entities/scene.js';

export default class Director {
	constructor(gamecore) {
		this.parent = gamecore;
	}

	loadBasicScenes(callback) {
		this.parent.networkOut('requestBasicScenes', null, (scenes) => {
			for (let i = 0; i < scenes.length; i++) {
				this.constructScene(scenes[i]);
			}

			callback();
		});
	}

	async constructScene(sceneJSON) {
		let scene;
		if (sceneJSON.type) {
			const sceneEntity = await import('../entities/' + sceneJSON + '.js');
			scene = new sceneEntity();
		} else {
			scene = new Scene(sceneJSON.name);
		}

		console.log('construct!');
		await scene.dynamic(sceneJSON);

		this.parent.addScene(scene);
	}
}