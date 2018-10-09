require('dotenv').config()

var mysql = require(process.env.DB_CONNECTION);
var sql = "";
var database_name = 'webrpg';
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

//CREATE database 'database_name'
con.query("CREATE DATABASE IF NOT EXISTS " + database_name, function (err, result) {
	if (err) throw err;
	console.log("Database created");
});

//CHANGE to database 'database_name'
con.changeUser({database : database_name}, function(err) {
  if (err) throw err;
  console.log("Changed to " + database_name + " Database");
});

//CREATE TABLE

sql = `CREATE TABLE users (
id int(11) NOT NULL AUTO_INCREMENT, 
name varchar(255) NOT NULL, 
email varchar(255) NOT NULL, 
password varchar(255) NOT NULL, 
created_at datetime NOT NULL, 
updated_at datetime NOT NULL, 
PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1`

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