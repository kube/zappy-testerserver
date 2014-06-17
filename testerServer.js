#!/usr/bin/env node
var net = require('net'),
	Game = require('./Game.js'),
	parseParameters = require('./parseParameters.js');


/*
**	Parsing Config
*/
var config = parseParameters(process.argv);
console.log(config);


/*
**	Creating Game
*/
var	game = new Game(config.width, config.height, config.time, config.teams, config.acceptedClients);

// Create Teams
for (var i in config.teams)
	game.createTeam(config.teams[i]);


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
					// console.log(req[i]);
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

	/*
	**	Create Socket Delayed Response Method
	*/
	socket.respond = function(message, time) {
		var time_ms = parseInt((time / game.t) * 1000);
		setTimeout(function() {
			socket.write(message + '\n');
		}, time_ms);
	}

	/*
	**	Store current Connection & Create Bot
	*/
	var bot = game.createBot(socket);
	console.log('Bot #' + bot.name + ' connected.');
	socket.write('BIENVENUE\n')

	console.log(bot);

	/*
	**	Data Event
	*/
	socket.on('data', function(data) {
		var req = data.toString().split('\n');

		// Send all requests to the Bot
		for (var i in req)
			bot.request(req[i].split(' '));
	});

	/*
	**	Close current session
	*/
	socket.on('close', function() {
		game.removeBot(bot);
		console.log('Bot #' + bot.name + ' closed session.');
		bot = null;
	});

}).listen(config.botPort, 'localhost');
