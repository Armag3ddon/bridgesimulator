/* Configuration management

Default configuration is found in ./internal/defaults.json.
A custom configuration should be placed in ./config.json but it optional.
Without a custom config, the server won't be password protected.
This is no problem when running locally, i.e. home LAN.
*/

const defaults = require('./defaults.json');
const path = require('path');
const fs = require('fs');

class Config {
	constructor() {
		this.defaults = defaults;
		this.config = {};

		try {
			this.config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../config.json')));
		} catch (error) {
			console.warn("[WARNING]: No custom configuration file (./config.json) found. Using defaults only.");
		}
	}

	getConfig(key) {
		if (this.config[key] !== undefined)
			return this.config[key];
		if (this.defaults[key] !== undefined)
		return this.defaults[key];

		console.error(`[ERROR]: Configuration for "${key}" requested but does not exist.`);
		return null;
	}
}

module.exports = Config;