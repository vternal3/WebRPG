/**
* Module dependencies.
*/
var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
require('dotenv').config();
var session = require('express-session');
var app = express();
var server = require('http').Server(app);
// var server = require('https').Server(app);
var io = require('socket.io')(server);

// var fs = require("fs");

// const options = {
  // key: fs.readFileSync("/srv/www/keys/my-site-key.pem"),
  // cert: fs.readFileSync("/srv/www/keys/chain.pem")
// };

var mysql      = require('mysql');
var bodyParser=require("body-parser");
var port = 8082;
var connection = mysql.createConnection({
	host     : process.env.DB_HOST,
	user     : process.env.DB_USERNAME,
	password : process.env.DB_PASSWORD,
	database : process.env.DB_DATABASE
});
connection.connect();
global.db = connection;
 
// all environments // Middleware
app.set('port', process.env.PORT || port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(session({
	secret: 'keyboard cat',
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
app.get('/logout', user.logout);//call for logout
app.get('/:token', user.index);

//Middleware
// app.listen(port, function(){
	// console.log("listening on *:" + port);
// });

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
	console.log('a user connected');
	socket.on('disconnect', function(){
		console.log('user disconnected');
		// remove this player from our players object
		delete players[socket.id];
		// emit a message to all players to remove this player
		io.emit('disconnect', socket.id);
	});
	
	//Randomly set the players location inside the 800x600
	//canvas. And set which team the player is on
	players[socket.id] = {
		rotation: 0,
		x: Math.floor(Math.random() * 700) + 50,
		y: Math.floor(Math.random() * 500) + 50,
		playerId: socket.id,
		team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
	};
	
	// send the players object to the new player
	socket.emit('currentPlayers', players);
	
	// send the star object to the new player
	socket.emit('starLocation', star);
	
	// send the current scores
	socket.emit('scoreUpdate', scores);
	
	// update all other players of the new player
	socket.broadcast.emit('newPlayer', players[socket.id]);
	
	// when a player moves, update the player data
	socket.on('playerMovement', function (movementData) {
		players[socket.id].x = movementData.x;
		players[socket.id].y = movementData.y;
		players[socket.id].rotation = movementData.rotation;
		// emit a message to all players about the player that moved
		socket.broadcast.emit('playerMoved', players[socket.id]);
	});
	
	socket.on('starCollected', function () {
		if (players[socket.id].team === 'red') {
			scores.red += 10;
		} else {
			scores.blue += 10;
		}
		star.x = Math.floor(Math.random() * 700) + 50;
		star.y = Math.floor(Math.random() * 500) + 50;
		io.emit('starLocation', star);
		io.emit('scoreUpdate', scores);
	});
});

server.listen(port, function(){
console.log(`listening on *:${server.address().port}`);
});
// server.createServer(options, app).listen(3000, function(){
// console.log(`listening on *:${server.address().port}`);
// });