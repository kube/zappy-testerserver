var Ressource = require('./Ressource.js'),
	ressourcesNames = require('./ressourcesNames.js');

var Block = function(map, x, y) {
	var self = this;
	var game = map.game;
	var _bots = [];

	this.x = x;
	this.y = y;
	this.map = map;

	this.ressources = [];
	for (var i = 0; i < 7; i++)
		this.ressources[i] = new Ressource(game, i);

	this.response = {
		bct: function() {
			return ('bct ' + self.x + ' ' + self.y + ' ' + self.ressources[0].quantity + ' ' + self.ressources[1].quantity + ' ' +self.ressources[2].quantity + ' ' + self.ressources[3].quantity + ' ' + self.ressources[4].quantity + ' ' + self.ressources[5].quantity + ' ' + self.ressources[6].quantity + '\n');
		}
	}

	this.addBot = function(bot) {
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

	this.getContent = function(playerAsking) {

		var string = '';

		for (var i in _bots){
			if (_bots[i] != playerAsking) {
				if (string != '')
					string += ' ';
				string += 'joueur';
			}
		}
		for (var i in self.ressources) {
			for (var j = 0; j < self.ressources[i].quantity; j++) {
				if (string != '')
					string += ' ';
				string += ressourcesNames[i];
			}
		}
		return string;
	}

	this.countBotsAtLevel = function(level) {
		var nb = 0;

		for (var i in _bots) {
			if (_bots[i].level == level)
				nb++;
		}
		return nb;
	}
}

module.exports = Block;
