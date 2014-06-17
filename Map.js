var Block = require('./Block.js');

var Map = function(game, width, height) {
	var self = this;

	if (height <= 0 || width <= 0)
		throw new Error("Invalid Map size");

	this.width = width;
	this.height = height;
	this.blocks = [];
	this.game = game;

	function initBlocks() {
		for (var i = 0; i < width; i++) {
			self.blocks[i] = [];
			for (var j = 0; j < height; j++)
				self.blocks[i][j] = new Block(self, i, j);
		}
	}
	initBlocks();

	this.getBlock = function(x, y) {
		x = (x % self.width + self.width) % self.width;
		y = (y % self.height + self.height) % self.height;
		return self.blocks[x][y];
	}

	/*
	**	Responses
	*/
	this.response = {

		mct: function() {
			var content = '';
			for (var i = 0; i < self.width; i++)
				for (var j = 0; j < self.height; j++)
					content += self.blocks[i][j].response.bct();
			return content;
		},

		msz: function() {
			return 'msz ' + self.width + ' ' + self.height + '\n';
		}
	};
}

module.exports = Map;
