export default {
	urls: [],

	// Add an image to be loaded
	add(url) {
		this.urls.push( url );
	},

	// Load all images previously added to the list
	loadAll(callback) {
		this.load(this.urls, callback);
	},

	// Load a a given array of images
	load(images, callback) {
		let total = 0, loaded = 0;

		function complete() {
			if( ++loaded >= total ) callback();
		}

		while( images.length ) {
			const url = images.shift();
			if( typeof this[url] == 'undefined' ) {
				total++;
				this[url] = new Image();
				this[url].onload = complete;
				this[url].src = url;
			}
		}

		if( total == 0 ) callback();
	}
};