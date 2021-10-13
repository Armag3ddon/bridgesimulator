/* The director manages and constructs the scenes */

import Scene from '../entities/scene.js';

export default class Director {
	constructor(gamecore) {
		this.parent = gamecore;
	}

	async loadBasicScenes(callback) {
		this.parent.networkOut('requestBasicScenes', null, async (scenes) => {
			for (let i = 0; i < scenes.length; i++) {
				await this.constructScene(scenes[i]);
			}

			callback();
		});
	}

	async constructScene(sceneJSON) {
		let scene;
		if (sceneJSON.type) {
			const sceneEntity = await import('../entities/' + sceneJSON.type + '.js');
			scene = new sceneEntity.default();
		} else {
			scene = new Scene(sceneJSON.name);
		}

		const handles = {};
		await scene.dynamic(sceneJSON, handles);
		for (const handle in handles) {
			scene[handle] = handles[handle];
		}
		if (sceneJSON.functions) {
			for (const functionName in sceneJSON.functions) {
				const newFunction = new Function(sceneJSON.functions[functionName].arguments,
					sceneJSON.functions[functionName].body);
				scene[functionName] = newFunction;
			}
		}

		this.parent.addScene(scene);
	}
}