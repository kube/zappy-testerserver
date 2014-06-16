var Bot = function(game, number, x, y, orientation) {
	var self = this;

	// game.map.blocks[x][y].ressources[type]

	this.game = game;
	this.name = number;
	this.x = x;
	this.y = y;
	// N:1, E:2, S:3, O:4
	this.orientation = orientation;
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
				if ((this.y - 1) >= 0) {
					this.y--;
				} else {
					this.y = 0;
				}
				break;
			case 2:
				if ((this.x + 1) < this.game.map.width) {
					this.x++;
				} else {
					this.x = this.game.map.width - 1;
				}
				break;
			case 3:
				if ((this.y + 1) < this.game.map.height) {
					this.y++;
				} else {
					this.y = this.game.map.height - 1;
				}
				break;
			case 4:
				if ((this.x - 1) >= 0) {
					this.x--;
				} else {
					this.x = 0;
				}
				break;
		}
		return "ok\n";
	}

	this.droite = function() {
		this.orientation = (this.orientation + 1) % 5
		return "ok\n";
	}

	this.gauche = function() {
		if (this.orientation != 0) {
			this.orientation--;
		} else {
			this.orientation = 4;
		}
		return "ok\n";
	}
}

module.exports = Bot;
