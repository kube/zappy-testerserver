var Ressource = require('./Ressource.js');

var Block = function(map, x, y) {
	var self = this;
	var game = map.game;

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
}

module.exports = Block;
