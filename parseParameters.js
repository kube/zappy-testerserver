var Team = require('./Team.js');

/*
**	Game Constants
*/
var	MIN_MAP_X = 6,
	MAX_MAP_X = 6,
	MIN_MAP_Y = 6,
	MAX_MAP_Y = 6;

/*
**	Default Config
*/
var config = {
	graphicPort: 1337,
	botPort: 4242,
	width: Math.floor((Math.random() * (MAX_MAP_X - MIN_MAP_X)) + MIN_MAP_X),
	height: Math.floor((Math.random() * (MAX_MAP_Y - MIN_MAP_Y)) + MIN_MAP_Y),
	teams: [],
	acceptedClients: 10,
	time: 7
}

function isParameterHead(arg) {
	var reg = /^\-/;
	return !!arg.match(reg);
}

var parseParameters = function(argv) {

	for (var i = 0; i < argv.length; i++) {
		var arg = argv[i];
		if (isParameterHead(arg))
			switch (arg) {

				case '-n':
					for (var k = i + 1; argv[k] && !isParameterHead(argv[k]); k++)
						config.teams[argv[k]] = new Team(argv[k]);
					if (k == i + 1) {
						console.error('Not enough teams');
						process.exit(1);
					}
					break;

				case '-p':
					if (!isParameterHead(argv[i + 1]))
						config.botPort = parseInt(argv[i + 1]);
					break;

				case '-g':
					if (!isParameterHead(argv[i + 1]))
						config.graphicPort = parseInt(argv[i + 1]);
					break;

				case '-x':
					if (!isParameterHead(argv[i + 1]))
						config.width = parseInt(argv[i + 1]);
					break;

				case '-y':
					if (!isParameterHead(argv[i + 1]))
						config.height = parseInt(argv[i + 1]);
					break;

				case '-t':
					if (!isParameterHead(argv[i + 1])) {	
						config.acceptedClients = parseInt(argv[i + 1]);
						if (config.acceptedClients <= 0) {	
							console.error('Invalid time');
							process.exit(1);
						}
					}

				case '-c':
					if (!isParameterHead(argv[i + 1])) {	
						config.acceptedClients = parseInt(argv[i + 1]);
						if (config.acceptedClients <= 0) {
							console.error('Invalid accepted clients number');
							process.exit(1);
						}
					}
					break;

				default:
					console.error('Unknown argument ' + arg);
					process.exit(1);
					break;
			}
	}
	return config;
}

module.exports = parseParameters;