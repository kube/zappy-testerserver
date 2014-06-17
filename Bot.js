var Ressource = require('./Ressource.js'),
	ressourcesNames = require('./ressourcesNames.js');

var Bot = function(game, socket) {
	var self = this;

	this.game = game;
	this.name = null;

	this.x = Math.floor(Math.random() * game.map.width);;
	this.y = Math.floor(Math.random() * game.map.height);;

	// N:1, E:2, S:3, O:4
	this.orientation = Math.floor((Math.random() * 4) + 1);
	this.level = 1;
	this.team = null;
	this.nb_client = 10;

	this.ressources = [];
	for (var i = 0; i < 7; i++)
		this.ressources[i] = new Ressource(game, i);

	// Put Bot in Block
	this.block = game.map.blocks[this.x][this.y];
	this.block.addBot(this);


	/*
	**	Bot Commands
	*/
	this.avance = function() {
		var sign = (self.orientation == 1 || self.orientation == 4) ? -1 : 1;

		// Remove Bot from its current Block
		self.block.removeBot(self);

		if (self.orientation % 2)
			self.y = (self.y + sign + self.height) % self.height;
		else
			self.x = (self.x + sign + self.width) % self.width;

		// Add Bot to its new Block
		self.block = self.game.map.blocks[self.x][self.y];
		self.block.addBot(self);
		socket.respond('ok', 7);
	}

	this.droite = function() {
		self.orientation = self.orientation % 4 + 1;
		socket.respond('ok', 7);
	}

	this.gauche = function() {
		self.orientation = (self.orientation - 2 + 4) % 4 + 1;
		socket.respond('ok', 7);
	}

	this.inventaire = function() {
		var response = '{';

		for (var i in self.ressources) {
			if (response != '{')
				response += ', ';
			response += ressourcesNames[i] + ' ' + self.ressources[i].quantity;
		}
		response += '}';
		console.log(self.ressources);
		socket.respond(response, 1);
	}

	this.voir = function() {
		var	response = '{',
			fov = 1,
			sign = (self.orientation == 1 || self.orientation == 4) ? -1 : 1,
			xa,
			ya;

		for (var i = 0; i <= self.level; i++) {
			for (var j = 0; j < fov; j++) {

				if (self.orientation % 2) {
					xa = self.x - parseInt(fov / 2) + j;
					ya = self.y + sign * i;
				}
				else {
					ya = self.y - parseInt(fov / 2) + j;
					xa = self.x + sign * i;
				}
				var block = self.game.map.getBlock(xa, ya);
				if (i > 0 || j > 0)
					response += ', '
				response += block.getContent(self);
			}
			fov += 2;
		}
		response += '}';
		socket.respond(response, 7);
	}

	this.pose = function(name) {
		var type = ressourcesNames.indexOf(name);

		if (self.ressources[type].quantity > 0) {
			self.ressources[type].remove(1);
			self.block.ressources[type].add(1);
			socket.respond('ok', 7);
		}
		else
			socket.respond('ko', 7);
	}

	this.prend = function(name) {
		var type = ressourcesNames.indexOf(name);

		if (self.block.ressources[type].quantity > 0) {
			self.block.ressources[type].remove(1);
			self.ressources[type].add(1);
			socket.respond('ok', 7);
		}
		else
			socket.respond('ko', 7);
	}


	/*
	**	Request Execution
	*/
	this.request = function(req) {

		console.log(req);
		if (!self.team) {
			self.team = game.teams[req[0]];
			socket.write('' + self.nb_client + '\n' + game.map.width + ' ' + game.map.height + '\n')
		}
		else
			switch (req[0]) {

				case 'connect_nbr':
					socket.write('' + self.nb_client + '\n')
					break;

				case 'avance':
					self.avance();
					break;

				case 'droite':
					self.droite();
					break;

				case 'gauche':
					self.gauche();
					break;

				case 'voir':
					self.voir();
					break;

				case 'inventaire':
					self.inventaire();
					break;

				case 'pose':
					self.pose(req[1]);
					break;

				case 'prend':
					self.prend(req[1]);
					break;
			}
	}

	this.destroy = function() {
		self.team.removeBot(self);
		self.block.remoteBot(self);
	}
}

module.exports = Bot;
