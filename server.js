/**
* Module dependencies.
*/
var express = require('express')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
require('dotenv').config();
var session = require('express-session');
var app = express();
var sizeof = require('object-sizeof')
//Redirect 'http' requests to secure 'https'
http.createServer(function (req, res) {
	//TODO: add in parameters 'req.params.' so that we can get SSL working for www.webrpg.io
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(process.env.HTTP_PORT);
var fs = require("fs");
const options = {
  key: fs.readFileSync(process.env.DOMAIN_KEY),
  cert: fs.readFileSync(process.env.DOMAIN_CERT)
};
var port = process.env.HTTPS_PORT;
var server = require('https').createServer(options, app);
server.listen(port, function(){
	console.log("listening on *:" + port);
});
//TODO put the pingInterval and pingTimeout values inside .env file
var io = require('socket.io')(server, {'pingInterval': 10000, 'pingTimeout': 60000});
var mysql      = require('mysql');
var bodyParser=require("body-parser");
var connection = mysql.createConnection({
	host     : process.env.DB_HOST,
	user     : process.env.DB_USERNAME,
	password : process.env.DB_PASSWORD,
	database : process.env.DB_DATABASE
});
connection.connect();
global.db = connection;
//Code to keep the connection to MySQL so that
//connection doesn't time out.
setInterval(function () {
	console.log("Keep MySQL Alive");
    global.db.query('SELECT 1');
}, 3600000); //Once every hour do a query to keep connection alive
// all environments // Middleware
app.set('port', process.env.HTTPS_PORT || port);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}));
			
//https://stackoverflow.com/questions/6096492/node-js-and-express-session-handling-back-button-problem/6505456
//Prevents the back button from going back into pages
//you are not authenticated for anymore.
app.use(function(req, res, next) {
	res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	next();
});
 
 
 // // Catch /view and do whatever you like
// app.all('/view', function(req, res) {
	// res.redirect('/client.html');
// });
// // Catch NOT /view and do whatever you like
// app.get(/^(?!\/view$).*$/, function(req, res) {
  // res.redirect('/humans.txt');
// });
 
// creates our routes
app.post('/', user.index);
app.post('/:token', user.index);
app.get('/:token', user.index);

// server socket.io code
var players = {};
var players_shots = {};
var movementTime = {};
var velocity_speed = 0.2;
var server_update_frequency = 1000 / 60;

io.on('connection', function(socket){
	if(socket.handshake.address == '::ffff:194.44.240.61') //blacklist
		return;
	console.log('ADDRESS: '+ socket.handshake.address + ' TIME: ' + socket.handshake.time);
	
	//TODO: Seperate out this call into a 'crpTokenHandshake' call
	//and only update using crpToken for the WHERE
	//Request email address
	socket.on('crpTokenHandshake', function (crptoken) {
		if(crptoken == null) {
			return;
		}
		var sql = "SELECT * FROM `users` WHERE `crpToken`=" + db.escape(crptoken);
		db.query(sql, function(err, results) {
			if (err) throw err;
			if(results.length == 1) {
				if(results[0].loggedIn == 1){
					console.log("returning from crpTokenHandshake");
					socket.emit('alreadyLoggedIn', 'https://webrpg.io/?login_error=Already logged in&email=' + results[0].email);
					return;
				} else {
					var sql = "UPDATE users SET socket = " + db.escape(socket.id) + ", loggedIn = '" + 1 + "' WHERE crpToken = " + db.escape(crptoken);
					db.query(sql, function(err, results){ 
						if (err) throw err;
						if(results.affectedRows == 1) {
							console.log("CrpTokenHandshake Successfully updated socket and crptoken");
						}
						else {
							console.log("CrpTokenHandshake Error updating socket and crpToken");
						}
					});
					socket.emit('notLoggedIn', null);
				}
			} else {
				console.log("CrpTokenHandshake Error crpToken not found");
				socket.emit('alreadyLoggedIn', 'https://webrpg.io/?login_error=Invalid token. Please re-login&email= ');
				return;
			}
		});
	});
	
	socket.on('disconnect', function(){
		console.log('user disconnected');
		//log the player who disconnected out by changing its 
		//loggedIn column to 0 and set socket to null.
		var sql = "UPDATE users SET socket = '" + null + "', loggedIn = '" + 0 + "', crpToken = '" + null + "' WHERE socket = " + db.escape(socket.id);
		db.query(sql, function(err, results){ 
			if (err) throw err;
			if(results.affectedRows == 1) {
				console.log("DISCONNECTING Successfully updated socket and loggedIn");
			} else {
				console.log("DISCONNECTING Error updating socket and loggedIn");
			}
		});

		if(players[socket.id]) {
			sql = "UPDATE player_stats SET x = '" + players[socket.id].x + "', y = '" +  players[socket.id].y + "' WHERE name = '" + players[socket.id].name + "'";
			db.query(sql, function(err, results){ 
				if (err) throw err;
				if(results.affectedRows == 1) {
					console.log("Updated player's X and Y successfully");
				} else {
					console.log("Error updating player's X and Y");
				}
			});
		}

		// remove this player from our players object
		delete players[socket.id];
		console.log("Size of players: " + sizeof(players) + " bytes");
		console.log("player counter: " + Object.keys(players).length);
		// emit a message to all players to remove this player
		io.emit('disconnect', socket.id);
	});

	socket.on("requestCharacters", function(){
		var sql = "SELECT * FROM `users` WHERE `socket`=" + db.escape(socket.id);
		db.query(sql, function(err, results) {
		    if (err) throw err;
		    if(results.length == 1) {
				console.log("got user");
				sql = "SELECT * FROM `player_stats` WHERE `user_id`=" + db.escape(results[0].id);
				db.query(sql, function(err, results) {
					if (err) throw err;
					if(results.length) {
						socket.emit('characters', results);
						console.log("sent characters");
					} else {
						console.log("no characters");
					}
				});
		    } else {
				console.log("user doesn't exist");
			}
		});
	});

	socket.on("deleteCharacter", function(name){
		var sql = "SELECT * FROM `users` WHERE `socket`=" + db.escape(socket.id);
		db.query(sql, function(err, resultsUsers) {
		    if (err) throw err;
		    if(resultsUsers.length == 1) {
				console.log("got user");
				sql = "DELETE FROM player_stats WHERE name = " + db.escape(name);
				console.log(sql);
				db.query(sql, function(err, results) {
					if (err) throw err;
					if(results.affectedRows == 1) {
						console.log("deleted character: " + name);
						sql = "SELECT * FROM `player_stats` WHERE `user_id`=" + db.escape(resultsUsers[0].id);
						db.query(sql, function(err, results) {
							if (err) throw err;
							if(results.length) {
								socket.emit('characters', results);
								console.log("sent characters");
							} else {
								console.log("no characters");
							}
						});
					} else {
						console.log("no characters");
					}
				});
		    } else {
				console.log("user doesn't exist");
			}
		});
	});

	socket.on("requestSettings", function(){
		var sql = "SELECT * FROM `users` WHERE `socket`=" + db.escape(socket.id);
		db.query(sql, function(err, results) {
		    if (err) throw err;
		    if(results.length == 1) {
				console.log("got user");
				sql = "SELECT * FROM `user_settings` WHERE `user_id`=" + db.escape(results[0].id);
				db.query(sql, function(err, results) {
					if (err) throw err;
					if(results.length) {
						socket.emit('settings', results[0]);
						console.log("sent settings");
					} else {
						console.log("no settings");
					}
				});
		    } else {
				console.log("user doesn't exist");
			}
		});
	});

	socket.on("requestGameSettings", function(){
		var sql = "SELECT * FROM `users` WHERE `socket`=" + db.escape(socket.id);
		db.query(sql, function(err, results) {
		    if (err) throw err;
		    if(results.length == 1) {
				console.log("got user");
				sql = "SELECT * FROM `user_settings` WHERE `user_id`=" + db.escape(results[0].id);
				db.query(sql, function(err, results) {
					if (err) throw err;
					if(results.length) {
						socket.emit('gameSettings', results[0]);
						console.log("sent game settings");
					} else {
						console.log("no game settings");
					}
				});
		    } else {
				console.log("user doesn't exist");
			}
		});
	});

	socket.on("saveSettings", function(settings){
		var sql = "SELECT * FROM `users` WHERE `socket`=" + db.escape(socket.id);
		db.query(sql, function(err, results) {
		    if (err) throw err;
		    if(results.length == 1) {
				console.log("got user");
				sql = "UPDATE `user_settings` SET fullscreen = '" + settings["fullscreen"] + 
				"', music_volume = '" + settings["music_volume"] + 
				"', pause_on_blur = '" + settings["pause_on_blur"] +
				"', show_fps = '" + settings["show_fps"] +
				"', show_ping = '" + settings["show_ping"] +
				"', show_player_count = '" + settings["show_player_count"] +
				"', sound_volume = '" + settings["sound_volume"] + "' WHERE `user_id`=" + db.escape(results[0].id);
				db.query(sql, function(err, results) {
					if (err) throw err;
					if(results.affectedRows == 1) {
						console.log("Updated settings");
					} else {
						console.log("Error updating settings");
					}
				});
			} else {
				console.log("user doesn't exist");
			}
		});
	});

	socket.on("create_player", function(name){
		var sql = "SELECT * FROM `users` WHERE `socket`=" + db.escape(socket.id);
		db.query(sql, function(err, results) {
		    if (err) throw err;
		    if(results.length == 1) {
				var id = results[0].id;
				sql = "INSERT INTO player_stats (user_id, name, x, y) VALUES (" + results[0].id + ", '" + name + "', " + 0 + ", " + 0 + ")";
				//console.log(sql);
				db.query(sql, function(err, results){ 
					//console.log("ERRROR:  " + err);
					if (err && err.code == "ER_DUP_ENTRY"){
						socket.emit("name_unavailable");
						console.log("Error character name already exists");
						return;
					} else if (err) throw err;
					if(results.affectedRows == 1) {
						console.log("Added new character: " + name);
						sql = "SELECT * FROM `player_stats` WHERE `user_id`=" + db.escape(id);
						db.query(sql, function(err, results) {
							if (err) throw err;
							if(results.length) {
								socket.emit('characters', results);
								console.log("sent characters");
							} else {
								console.log("no characters");
							}
						});
					} else {
						console.log("something went wrong when trying to INSERT")
					}
				});
			} else {

			}
		});
	});

	socket.on('game_start', function(characterName){
		players[socket.id] = {
			direction: 8,
			x: 0,
			y: 0,
			playerId: socket.id,
			name: ""//characterName ? characterName : "tester-" + socket.id.substring(0, 4)
		};
		players_shots[socket.id] = {
			time: 0
		};
		
		console.log("Size of players: " + sizeof(players) + " bytes");
		console.log("character name : " + characterName);
		//TODO: Run a sql query to check if this socket is actually logged in
		//if it is not logged in then do not load the player stats info, but instead
		//append a random sequence of 5 characters to the end of the name i.e.
		//'test-oidna' if user entered in nickname 'test'
		//TODO: change this to select a player name from character scene selection
		var sql = "SELECT name, x, y FROM player_stats WHERE name = " + "'" + characterName + "'";                           
		
		db.query(sql, function(err, results) {
			if (err) throw err;
			if(results.length == 1) {
				players[socket.id].name = results[0].name;
				players[socket.id].x = results[0].x;
				players[socket.id].y = results[0].y;
				console.log("succesfully set name, x and y");
				
				// send the players object to the new player
				socket.emit('currentPlayers', players);
				
				// update all other players of the new player
				socket.broadcast.emit('newPlayer', players[socket.id]);
			} else {
				//console.log("error setting  name, x and y, character doesn't exist");
				console.log("created a test account");
				players[socket.id].name = characterName;
				// send the players object to the new player
				socket.emit('currentPlayers', players);
				
				// update all other players of the new player
				socket.broadcast.emit('newPlayer', players[socket.id]);
			}
		});
		console.log("player counter: " + Object.keys(players).length);
	});

	socket.on('playerMoved', function (direction) {
		//TODO: Think about storing a list of player inputs inside a queue
		//and then resolving the inputs in another setInterval function
		if(players[socket.id]) {
			players[socket.id].direction = direction;
		}
		movementTime[socket.id] = Date.now();
	});

	socket.on('latency_ping', function() {
		socket.emit('latency_pong');
	});

	socket.on('player_shot', function(point){
		if(players_shots[socket.id].time > 1000){
			console.log("x: " + point.x + " y: " + point.y);
			players_shots[socket.id].time = 0;
		} else {
			console.log("too soon");
		}
	});
});

//Calculate player movement and colision detection
setInterval(() => {
	//check the list of player flags to see if any player is moving
	
	// players_shots[socket.id].time += server_update_frequency;
	for(var player in players) {
		//console.log(players);

		var start_time = Date.now();
		var delta = start_time - movementTime[players[player].playerId];
		movementTime[players[player].playerId] = start_time;

		players_shots[player].time += delta;
		//not idle
		if(players[player].direction != 8)
		{
			var velocity_x = 0;
			var velocity_y = 0;
			//set velocity_x and velocity_y according to direction
			switch(players[player].direction) {
				case 0:
					velocity_y = -velocity_speed;
					break;
				case 1:
					velocity_x = (Math.sqrt(2) / 2) * velocity_speed;
					velocity_y = (Math.sqrt(2) / 2) * -velocity_speed;
					break;
				case 2:
					velocity_x = velocity_speed;
					break;
				case 3:
					var speed = (Math.sqrt(2) / 2) * velocity_speed;
					velocity_x = speed
					velocity_y = speed;
					break;
				case 4:
					velocity_y = velocity_speed;
					break;
				case 5:
					velocity_x = (Math.sqrt(2) / 2) * -velocity_speed;
					velocity_y = (Math.sqrt(2) / 2) * velocity_speed;
					break;
				case 6:
					velocity_x = -velocity_speed;
					break;
				case 7:
					var speed = (Math.sqrt(2) / 2) * -velocity_speed;
					velocity_x = speed
					velocity_y = speed;
					break;
			}
			players[player].x += Math.round(delta * velocity_x);
			players[player].y += Math.round(delta * velocity_y);
		}
	}
}, server_update_frequency);

//broadcast all player's positions
setInterval(() => {
	io.emit('status_update', players);
}, 1000/20);

setInterval(() => {
	io.emit('player_count', Object.keys(players).length);
}, 5000);