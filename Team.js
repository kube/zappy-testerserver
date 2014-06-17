var Team = function(name) {
	var self = this;

	this.name = name;
	var _bots = [];

	this.nb_client = 10;

	this.addBot = function(bot) {
		if (self.nb_client) {
			_bots.push(bot);
			bot.team = self;
			self.nb_client--;
			console.log('NEW NB_CLIENT : ' + self.nb_client)
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
