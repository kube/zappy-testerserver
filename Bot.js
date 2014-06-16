var Bot = function(game, number, x, y, orientation, level, team) {
	var self = this;

	// game.map.blocks[x][y].ressources[type]

	this.name = number;
	this.x;
	this.y;
	this.orientation = orientation;
	this.level = level;
	this.team = team;
}

module.exports = Bot;
