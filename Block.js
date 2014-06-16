var Ressource = require('./Ressource.js');

var Block = function(map, x, y) {
	var self = this;
	var game = map.game;
	var _bots = [];

	this.x = x;
	this.y = y;
	this.map = map;


	this.ressources = [];
	for (var i = 0; i < 7; i++)
		this.ressources[i] = new Ressource(this, x, y, i);

	this.response = {
		bct: function() {
			return ('bct ' + self.x + ' ' + self.y + ' ' + self.ressources[0] + ' ' + self.ressources[1] + ' ' +self.ressources[2] + ' ' + self.ressources[3] + ' ' + self.ressources[4] + ' ' + self.ressources[5] + ' ' + self.ressources[6] + '\n');
		}
	}

	this.pushBot = function(bot) {
		if (_bots.indexOf(bot) == -1)
			_bots.push(bot);
	}

	this.removeBot = function(bot) {
		if (_bots.indexOf(bot) != -1)
			_bots.splice(_bots.indexOf(bot), 1);
	}

	this.getBots = function() {
		return _bots;
	}
}

module.exports = Block;
