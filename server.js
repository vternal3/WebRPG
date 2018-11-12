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

var star = {
  x: Math.floor(Math.random() * 700) + 50,
  y: Math.floor(Math.random() * 500) + 50
};

var scores = {
  blue: 0,
  red: 0
};


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
					socket.emit('alreadyLoggedIn', 'https://webrpg.io/?login_error=Already logged in&email= ');
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
	
	socket.on('requestEmail', function () {
		var sql = "SELECT `email` FROM `users` WHERE `socket`="+db.escape(socket.id);                           
		
		db.query(sql, function(err, results) {
			if (err) throw err;
			if(results.length == 1) {
				players[socket.id].email = results[0].email;
				socket.emit('emailSent', players[socket.id].email);
				console.log("succesfully sent email: " + results[0].email);
			} else {
				console.log("error sending email, user doesn't exist");
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
			}
			else {
				console.log("DISCONNECTING Error updating socket and loggedIn");
			}
		});
		
		// remove this player from our players object
		delete players[socket.id];
		// emit a message to all players to remove this player
		io.emit('disconnect', socket.id);
	});

	socket.on('game_start', function(){
		//TODO: wrap all the emits inside of a .on("game_start"){} call and when the
		//game_scene starts call socket.emit("game_start") and then run these emits.
		players[socket.id] = {
			direction: 8,
			x: Math.floor(Math.random() * 700) + 50,
			y: Math.floor(Math.random() * 500) + 50,
			playerId: socket.id,
			name: ""
		};
		
		// send the players object to the new player
		socket.emit('currentPlayers', players);
		
		// update all other players of the new player
		socket.broadcast.emit('newPlayer', players[socket.id]);
	});
	// when a player moves, update the player data
	socket.on('playerMovement', function (movementData) {
		if(players[socket.id] == null) {
			players[socket.id] = {
				direction: 8,
				x: Math.floor(Math.random() * 700) + 50,
				y: Math.floor(Math.random() * 500) + 50,
				playerId: socket.id,
				name: ""
			};
		}
		players[socket.id].x = movementData.x;
		players[socket.id].y = movementData.y;
		players[socket.id].direction = movementData.direction;
		players[socket.id].name = movementData.name;
		// emit a message to all players about the player that moved
		socket.broadcast.emit('playerMoved', players[socket.id]);
	});
});