var Map = require('./Map.js');
var Bot = require('./Bot.js');

MAX_STONE_PER_BLOCK = 11;

var Game = function(width, height) {
	var self = this;

	this.map = new Map(self, width, height);
	this.botClients = [];
	this.graphicClients = [];

	this.randomizeMap = function() {
		for (var i = 0; i < self.map.width; i++)
			for (var j = 0; j < self.map.height; j++)
				for (var k = 0; k < 7; k++)
					self.map.blocks[i][j].ressources[k] = Math.floor(Math.random() * MAX_STONE_PER_BLOCK);
	}

	this.createBot = function(number, x, y, orientation, level, team) {
		var bot = new Bot(self, number, x, y, orientation, level, team);
		this.bots[number] = bot;
		return bot;
	}

	this.randomizeMap();
}

module.exports = Game;
