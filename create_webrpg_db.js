require('dotenv').config()

var mysql = require(process.env.DB_CONNECTION);

var database_name = process.env.DB_DATABASE;
var tables = ['users'];

//CONNECT to mysql
var con = mysql.createConnection({
  host: process.env.DB_HOST,
  //database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//CREATE database
con.query("CREATE DATABASE IF NOT EXISTS " + database_name, function (err, result) {
	if (err) throw err;
	console.log("Database created");
});

//CHANGE to database
con.changeUser({database : database_name}, function(err) {
  if (err) throw err;
  console.log("Changed to " + database_name + " Database");
});

//CREATE TABLE

var sql = `CREATE TABLE users (
  id int(5) NOT NULL,
  email varchar(254) DEFAULT NULL,
  password varchar(60) NOT NULL,
  resetPasswordToken varchar(40) DEFAULT NULL,
  resetPasswordExpires datetime DEFAULT NULL,
  crpToken varchar(40) DEFAULT NULL,
  loggedIn tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1`;

con.query(sql, function (err, result) {
	if (err) throw err;
	console.log("Table created");
});

//INSERT one or more values into database 'database_name' table 'tables[0]'
// sql = "INSERT INTO " + tables[0] + " (nickname, passwords) VALUES  ?";
// var values = [
	// ['test_user1','test_password1'],
	// ['test_user2','test_password2'],
	// ['test_user3','test_password3'],
// ];
// con.query(sql, [values],function (err, result) {
	// if (err) throw err;
	// console.log(result.affectedRows + " record inserted into db: " + database_name + " table: " + tables[0]);
// });