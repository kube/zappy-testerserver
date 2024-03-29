var Ressource = require('./Ressource.js'),
	ressourcesNames = require('./ressourcesNames.js'),
	elevationRequirements = require('./elevationRequirements.js');

var Bot = function(game, socket) {
	var self = this;

	this.game = game;
	this.name = null;

	this.x = Math.floor(Math.random() * game.map.width);
	this.y = Math.floor(Math.random() * game.map.height);

	// N:1, E:2, S:3, O:4
	this.orientation = Math.floor((Math.random() * 4) + 1);
	this.level = 1;
	this.team = null;

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
			self.y = (self.y + sign + game.map.height) % game.map.height;
		else
			self.x = (self.x + sign + game.map.width) % game.map.width;

		// Add Bot to its new Block
		self.block = self.game.map.blocks[self.x][self.y];
		self.block.addBot(self);
		socket.respond('ok', 7);

		// Alert GFX
		self.sendPositionToGFX();
	}

	this.droite = function() {
		self.orientation = self.orientation % 4 + 1;
		socket.respond('ok', 7);

		// Alert GFX
		self.sendPositionToGFX();
	}

	this.gauche = function() {
		self.orientation = (self.orientation - 2 + 4) % 4 + 1;
		socket.respond('ok', 7);

		// Alert GFX
		self.sendPositionToGFX();
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
					response += ', ';
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

	this.incantation = function() {

		var valid = true,
			players = self.block.countBotsAtLevel(self.level);

		if (self.level >= 8)
			return ;
		if (players >= elevationRequirements[self.level].players) {
			for (var i = 1; i < 7; i++) {
				if (self.block.ressources[i] < elevationRequirements[self.level][i])
					valid = false;
			}
		}
		else
			valid = false;

		if (valid) {
			socket.write('elevation en cours\n');
			setTimeout(function() {
				self.level++;
				socket.write('niveau actuel : ' + self.level + '\n')
			}, (300 / game.t) * 1000);
		}

	}


	/*
	**	Request Execution
	*/
	this.request = function(req) {

		console.log(req);
		if (!self.team) {
			console.log('JOINING : `' + req[0] + '`');
			game.teams[req[0]].addBot(self);
			self.alertPopGFX();
		}
		else
			switch (req[0]) {

				case 'connect_nbr':
					socket.write('' + self.team.acceptedClients + '\n')
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

				case 'incantation':
					self.incantation(req[1]);
					break;
			}
	}


	/*
	**	Graphic Events
	*/
	this.alertPopGFX = function(client) {
		var message = 'pnw '
				+ self.x + ' '
				+ self.y + ' '
				+ self.orientation + ' '
				+ self.level + ' '
				+ self.team.name + '\n';

		if (client)
			client.write(message);
		else
			for (var i in game.graphicClients)
				game.graphicClients[i].write(message);
	}

	this.sendPositionToGFX = function(client) {
		var message = 'ppo '
				+ self.x + ' '
				+ self.y + ' '
				+ self.orientation + '\n';

		if (client)
			client.write(message);
		else
			for (var i in game.graphicClients)
				game.graphicClients[i].write(message);
	}


	/*
	**	Send message
	*/
	this.send = function(message, time) {
		setTimeout(function() {
			socket.write(message + '\n');
		}, time);
	};

	this.destroy = function() {
		self.team.removeBot(self);
		self.block.remoteBot(self);
	}
}

module.exports = Bot;
