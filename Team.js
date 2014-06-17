var Team = function(game, name, acceptedClients) {
	var self = this;

	this.name = name;
	var _bots = [];

	this.acceptedClients = acceptedClients;

	this.addBot = function(bot) {
		if (self.acceptedClients) {
			_bots.push(bot);
			bot.team = self;
			self.acceptedClients--;
			bot.send(self.acceptedClients + '\n' + game.map.width + ' ' + game.map.height, 0);
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
