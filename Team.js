var Team = function(name) {
	this.name = name;
	var _bots = [];

	this.addBot = function(bot) {
		_bots.push(bot);
	}

	this.removeBot = function(bot) {
		_bots.slice(_bots.indexOf(bot), 1);
	}

	this.getBots = function() {
		return _bots;
	}
}

module.exports = Team;
