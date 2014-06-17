var Map = require('./Map.js');
var Bot = require('./Bot.js');

MAX_STONE_PER_BLOCK = 11;

var Game = function(width, height, t, teams) {
	var self = this;

	this.map = new Map(self, width, height);
	this.t = t
	this.bots = [];
	this.graphicClients = [];
	this.teams = teams;

	this.randomizeMap = function() {
		for (var i = 0; i < self.map.width; i++)
			for (var j = 0; j < self.map.height; j++)
				for (var k = 0; k < 7; k++)
					self.map.blocks[i][j].ressources[k].update(Math.floor(Math.random() * MAX_STONE_PER_BLOCK));
	}

	this.createBot = function(socket) {
		var bot = new Bot(self, socket);
		self.bots.push(bot);
		bot.name = self.bots.indexOf(bot);
		return bot;
	}

	this.removeBot = function(bot) {
		self.bots.splice(self.bots.indexOf(bot), 1);
	}

	this.randomizeMap();
}

module.exports = Game;
