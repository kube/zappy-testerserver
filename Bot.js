var Bot = function(socket, game, number, x, y, orientation) {
	var self = this;

	// game.map.blocks[x][y].ressources[type]

	this.game = game;
	this.name = number;
	this.x = x;
	this.y = y;
	this.orientation = orientation;		// N:1, E:2, S:3, O:4
	this.level = 1;
	this.team = null;
	this.nb_client = 10;
	this.linemate = 0
	this.deraumere = 0
	this.sibur = 0
	this.mendiane = 0
	this.phiras = 0
	this.thystame = 0

	this.avance = function() {
		switch (this.orientation) {
			case 1:
				this.y = Math.max(0, this.y - 1);
				break;
			case 2:
				if ((this.x + 1) < this.game.map.width)
					this.x++;
				else
					this.x = this.game.map.width - 1;
				break;
			case 3:
				if ((this.y + 1) < this.game.map.height)
					this.y++;
				else
					this.y = this.game.map.height - 1;
				break;
			case 4:
				this.x = Math.max(0, this.x - 1);
				break;
		}
		self.respond('ok', 7);
	}

	this.droite = function() {
		self.orientation = (self.orientation + 1) % 5;
		self.respond('ok', 7);
	}

	this.gauche = function() {
		self.orientation = (self.orientation - 1 + self.orientation) % 5;
		self.respond('ok', 7);
	}

	this.destroy = function() {
		self.team.removeBot(self);
		self.block.remoteBot(self);
	}
}

module.exports = Bot;
