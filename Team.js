var Team = function(name) {
	this.name = name;
	var _bots = [];

	this.nb_client = 10;

	this.addBot = function(bot) {
		if (self.nb_client) {
			_bots.push(bot);
			self.nb_client--;
		}
	}

	this.removeBot = function(bot) {
		_bots.slice(_bots.indexOf(bot), 1);
	}

	this.getBots = function() {
		return _bots;
	}
}

module.exports = Team;
