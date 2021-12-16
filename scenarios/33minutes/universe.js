class Universe {
	constructor(engine) {
		this.parent = engine;

		this.ship = new HumanBattleship();
	}
}

module.exports = Universe;