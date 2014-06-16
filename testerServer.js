#!/usr/bin/env node
var net = require('net'),
	Game = require('./Game.js'),
	parseParameters = require('./parseParameters.js');

/*
**	Game Properties
*/
var	graphicPort = 1337,
	botPort = 4242;

var	MIN_MAP_X = 60,
	MAX_MAP_X = 60,
	MIN_MAP_Y = 60,
	MAX_MAP_Y = 60;


/*
**	Parsing Parameters
*/
var parameters = parseParameters(process.argv);
console.log(parameters);


/*
**	Creating Game
*/
var	width = parameters.width | Math.floor((Math.random() * (MAX_MAP_X - MIN_MAP_X)) + MIN_MAP_X),
	height = parameters.height | Math.floor((Math.random() * (MAX_MAP_Y - MIN_MAP_Y)) + MIN_MAP_Y);

var	game = new Game(width, height, 10);


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

}).listen(graphicPort, 'localhost');



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
	var bot = game.createBot(index, xpos, ypos, orientation);

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
						setTimeout
						socket.write(bot.avance());
						break;
				}
			} else {
				// Handshake
				bot.team = req[i];
				socket.write('' + bot.nb_client + '\n' + game.map.width + ' ' + game.map.height + '\n')
			}
		}
	});

	/*
	**	Close current session
	*/
	socket.on('close', function() {
		game.botClients.splice(index, 1);
		console.log('Bot #' + index + ' closed session.');
	});

}).listen(botPort, 'localhost');
