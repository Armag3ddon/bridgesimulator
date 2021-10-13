/* Handle the loading of all json files.
 * All files core files can be replaced entirely or appended */

const path = require('path');
const fs = require('fs');
const mergeJSON = require('merge-json');
const i18next = require('i18next');

class JSONLoader {
	constructor(core_directory, custom_directory) {
		this.core = core_directory;
		this.custom = custom_directory;
	}
	
	loadJSON(filepath) {
		let result, custom;
		try {
			result = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..' + this.core, filepath + '.json')));
		} catch {
			console.error(i18next.t('server.errors.failed_json', { filepath: filepath }));
			throw null;
		}
		try {
			custom = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..' + this.custom, filepath + '.json')));
		} catch {
			custom = null;
		}
		if (custom) {
			mergeJSON.merge(result, custom);
			console.info(i18next.t('server.engine.custom_json', { filepath: filepath }));
		}
		return result;
	}
}

module.exports = JSONLoader;