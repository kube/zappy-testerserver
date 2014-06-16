var net = require('net');
var Game = require('./Game.js');

/*
**	Game Properties
*/
var	graphicPort = 1337,
	botPort = 4242;

var	minMapX = 10,
	maxMapX = 10,
	minMapY = 10,
	maxMapY = 10;


/*
**	Creating Game
*/
var	width = Math.floor((Math.random() * (maxMapX - minMapX)) + minMapX),
	height = Math.floor((Math.random() * (maxMapY - minMapY)) + minMapY);

var	game = new Game(width, height);



/*
**	Creating GfxServer
*/
var gfxServer = net.createServer(function (socket) {
	socket.write('Welcome to the server\r\n');

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
}).listen(graphicPort, 'localhost');



/*
**	Creating BotServer
*/
var botServer = net.createServer(function (socket) {
	socket.write('Welcome to the server\r\n');

	socket.on('data', function(data) {
		var req = data.toString().split('\n');

		for (var i in req){
			req[i] = req[i].split(' ');

			switch (req[i][0]) {

			}
		}

	});
}).listen(botPort, 'localhost');
