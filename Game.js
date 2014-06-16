var Map = require('./Map.js');
var Bot = require('./Bot.js');

MAX_STONE_PER_BLOCK = 11;

var Game = function(width, height, t, teams) {
	var self = this;

	this.map = new Map(self, width, height);
	this.t = t
	this.botClients = [];
	this.graphicClients = [];
	this.teams = teams;

	this.randomizeMap = function() {
		for (var i = 0; i < self.map.width; i++)
			for (var j = 0; j < self.map.height; j++)
				for (var k = 0; k < 7; k++)
					self.map.blocks[i][j].ressources[k] = Math.floor(Math.random() * MAX_STONE_PER_BLOCK);
	}

	this.createBot = function(number, x, y, orientation) {
		var bot = new Bot(self, number, x, y, orientation);
		self.botClients[number] = bot;
		return bot;
	}

	this.removeBot = function(bot) {
		self.botClients.splice(self.botClients.indexOf(bot), 1);
	}

	this.randomizeMap();
}

module.exports = Game;
