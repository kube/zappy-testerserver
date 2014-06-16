#!/usr/bin/env node
var net = require('net'),
	Game = require('./Game.js'),
	parseParameters = require('./parseParameters.js');

/*
**	Game Constants
*/
var	MIN_MAP_X = 60,
	MAX_MAP_X = 60,
	MIN_MAP_Y = 60,
	MAX_MAP_Y = 60;


/*
**	Parsing Config
*/
var config = parseParameters(process.argv);
console.log(config);


/*
**	Creating Game
*/
var	width = config.width | Math.floor((Math.random() * (MAX_MAP_X - MIN_MAP_X)) + MIN_MAP_X),
	height = config.height | Math.floor((Math.random() * (MAX_MAP_Y - MIN_MAP_Y)) + MIN_MAP_Y);

var	game = new Game(width, height, 10, config.teams);


/*
**	Creating GfxServer
*/
var gfxServer = net.createServer(function (socket) {

	// Store current connection
	game.graphicClients.push(socket);
	var index = game.graphicClients.indexOf(socket);

	console.log('Graphic Client #' + index + ' connected.');
	socket.write('Welcome to the server #' + index + ' \r\n');

	/*
	**	Data Event
	*/
	socket.on('data', function(data) {
		var req = data.toString().split('\n');

		for (var i in req){
			req[i] = req[i].split(' ');

			switch (req[i][0]) {

				case 'msz':
					console.log(req[i]);
					socket.write(game.map.response.msz());
					break;

				case 'bct':
					var x = parseInt(req[i][1]);
					var y = parseInt(req[i][2]);
					socket.write(game.map.blocks[x][y].response.bct());
					break;

				case 'mct':
					socket.write(game.map.response.mct());
					break;
			}
		}
	});

	/*
	**	Close current session
	*/
	socket.on('close', function() {
		game.graphicClients.splice(index, 1);
		console.log('Graphic Client #' + index + ' closed session.');
	});

}).listen(config.graphicPort, 'localhost');



/*
**	Creating BotServer
*/
var botServer = net.createServer(function (socket) {

	// Store current connection
	game.botClients.push(socket);
	var index = game.botClients.indexOf(socket);

	console.log('Bot #' + index + ' connected.');
	socket.write('BIENVENUE\n')

	var xpos = Math.floor(Math.random() * game.map.width);
	var ypos = Math.floor(Math.random() * game.map.height);

	// N:1, E:2, S:3, O:4
	var orientation = Math.floor((Math.random() * 4) + 1);
	var bot = game.createBot(socket, index, xpos, ypos, orientation);

	/*
	**	Socket Response Method
	*/
	socket.respond = function(message, time) {
		setTimeout(function() {
			socket.write(message + '\n');
		}, (time / game.t) * 1000);
	}

	/*
	**	Data Event
	*/
	socket.on('data', function(data) {
		var req = data.toString().split('\n');

		for (var i in req) {
			if (bot.team !== null) {
				req[i] = req[i].split(' ');

				switch (req[i][0]) {

					case 'connect_nbr':
						socket.write('' + bot.nb_client + '\n')
						break;

					case 'avance':
						bot.avance();
						break;

					case 'droite':
						bot.droite();
						break;

					case 'gauche':
						bot.gauche();
						break;
				}
			} else {
				// Handshake
				bot.team = game.teams[req[i]];
				console.log(bot.team);
				socket.write('' + bot.nb_client + '\n' + game.map.width + ' ' + game.map.height + '\n')
			}
		}
	});

	/*
	**	Close current session
	*/
	socket.on('close', function() {
		game.removeBot(bot);
		bot = null;
		console.log('Bot #' + index + ' closed session.');
	});

}).listen(config.botPort, 'localhost');
