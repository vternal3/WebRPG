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
 
// creates our routes
app.post('/', user.index);
app.post('/:token', user.index);
app.get('/logout', user.logout);//call for logout
app.get('/:token', user.index);

//Middleware
app.listen(port, function(){
	console.log("listening on *:" + port);
});
