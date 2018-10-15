const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
const async = require('async-waterfall');
const dateTime = require('node-datetime');
require('dotenv').config();

var salt_factor = 12;
//------------------------------------login/signup functionality----------------------------------------------
exports.index = function(req, res){
	//User signup response
    if(req.method == "POST" && req.body.signup_email != undefined) {
		console.log("signup attempt by '" + req.body.signup_email + "'");
		
		var post		= req.body;
		var pass 		= post.password;
		var confirmpass = post.confirm_password;
		var email 		= post.signup_email;
		//check that all fields are legit return any errors if not
		if(pass != confirmpass){
			console.log("passwords are not the same");
			res.redirect("/?signup_error=Passwords Not The Same");
			return;
		}
		
		//First check if the email address already exists
		var sql = "SELECT `email` FROM `users` WHERE `email`="+db.escape(email);
		var query = db.query(sql, function(err, results) {
			if (err) throw err;
			//Email is not unique
			if(results.length) {
				console.log("account for '" + email + "' already exists");
				res.redirect('/?signup_error=' + "account for '" + email + "' already exists");
				return;
			} else {
				//If email is unique then enter in the new account
				var salt = bcrypt.genSaltSync(salt_factor);
				pass = bcrypt.hashSync(pass,salt);
	  
				var sql = "INSERT INTO `users` (`email`, `password`, `resetPasswordToken`, `resetPasswordExpires`, `crpToken`, `loggedIn`) VALUES (" + db.escape(email) + "," + db.escape(pass) + ",'" + undefined + "','" + undefined + "','" + undefined + "','" + 0 +"')";

				var query = db.query(sql, function(err, results) {
					if (err) throw err;
					if(results.affectedRows == 1) {
						console.log("'" + email + "' successfully signup");
						//TODO: add login and or update index.html to recognize signup_success with crp token here
						res.redirect('/?signup_success');
						return;
					} else {
						console.log("'" + email + "' un-successfully signup could not insert into database");
						res.redirect('/?signup_error=Our Error Please Contact vternal3@gmail.com');
						return;
					}
				});
			}
		});
	//User Login response
	} else if(req.method == "POST" && req.body.login_email != undefined) {
		console.log("login attempt by '" + req.body.login_email + "'");
		
		var post = req.body;
		var email = post.login_email;
		var pass = post.password;
		
		var sql="SELECT `id`, `email`, `password` FROM `users` WHERE `email`="+db.escape(email);                           
		
		db.query(sql, function(err, results){ 
			if (err) throw err;
			if(results.length && bcrypt.compareSync(pass, results[0].password)){
				req.session.userId = results[0].id;
				req.session.user = results[0];
				console.log("'" + results[0].email + "' successfully logged in");
				res.redirect('/?login_success&id=' + results[0].id);
				return;
			}
			else{
				console.log("'" + email + "' un-successfully login");
				res.redirect('/?login_error&email=' + email);
				return;
			}       
        });
	//User forgot response
	} else if(req.method == "POST" && req.body.email != undefined) {
	   console.log("forgot attempt by '" + req.body.email + "'");
	   
		var email = req.body.email;
		
		//First check if the email address already exists
		var sql = "SELECT `id`, `email` FROM `users` WHERE `email`="+db.escape(email);
		var query = db.query(sql, function(err, results) {
			if (err) throw err;
			//Email exists
			if(results.length) {
				var token;
				var date;
				async([
					function(done) {
						crypto.randomBytes(20, function(err, buf) {
							token = buf.toString('hex');
							done(err, token);
						});
					},
					function(token,done) {
						date = Date.now() + 3600000; // 1 hour
						
						var d = new Date(date);
						dformat = [d.getFullYear(),
								   d.getMonth()+1,
								   d.getDate()].join('-')+' '+
								  [d.getHours(),
								   d.getMinutes(),
								   d.getSeconds()].join(':');
						
						var sql = "UPDATE users SET resetPasswordToken = '" + token + "', resetPasswordExpires = '" + dformat + "' WHERE id = " + db.escape(results[0].id);

						var query = db.query(sql, function(err, results) {
							if (err) throw err;
							if(results.affectedRows == 1) {
								var smtpTransport = nodemailer.createTransport({
									service: 'gmail',
									auth: {
										user: process.env.EMAIL_ADDRESS,
										pass: process.env.EMAIL_PASSWORD
									}
								});
								var mailOptions = {
									to: email,
									from: 'noreply@gmail.com',
									subject: 'webrpg.io Password Reset',
									text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
									  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
									  'https://' + req.headers.host + '/' + token + '\n\n' +
									  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
								};
								smtpTransport.sendMail(mailOptions, function(err, info) {
									if (err) throw err;
								});
								
								
								console.log("'" + email + "' successfully forgot");
								res.redirect('/?forgot_success&email=' + email);
								return;
							} else {
								console.log("'" + email + "' un-successfully forgot could not insert into database");
								res.redirect('/?forgot_error');
								return;
							}
						});
					},
				]);
			//Email doesn't exist
			} else {
				console.log("'" + email + "' un-successful forgot email doesn't exist");
				res.redirect('/?forgot_error=' + "account for email: '" + email + "' doesn't exist");
				return;
			}
		});
		//Forgot POST response
	} else if(req.method == "POST" && req.body.new_password != undefined){
		console.log("forgot POST token attempt by " + req.params.token);
		
		var token = req.params.token;
		var new_password = req.body.new_password;
		var confirm_password = req.body.confirm_password;
		//server side validation
		if(new_password != confirm_password) {
			console.log("passwords are not the same");
			res.redirect("/?forgot_post_error=Passwords Not The Same&token=" + token);
			return;
		}
		var salt = bcrypt.genSaltSync(salt_factor);
		new_password = bcrypt.hashSync(new_password,salt);
		if(token.length == 40) {
			var sql = "SELECT * FROM `users` WHERE `resetPasswordToken`=" + db.escape(token);
			var query = db.query(sql, function(err, results) {
				if (err) throw err;
				if(results.length == 1) {
					//check if the time has passed or not
					var date1 = new Date(results[0].resetPasswordExpires);
					var date2 = Date.now();
					var email = results[0].email;
					if(date2 < date1) {
						var sql = "UPDATE users SET password = '" + new_password + "', resetPasswordToken = '" + undefined + "', resetPasswordExpires = '" + undefined + "' WHERE id = " + db.escape(results[0].id);
						query = db.query(sql, function(err, results) {
							if (err) throw err;
							var smtpTransport = nodemailer.createTransport({
								service: 'gmail',
								auth: {
									user: process.env.EMAIL_ADDRESS,
									pass: process.env.EMAIL_PASSWORD
								}
							});
							var mailOptions = {
								to: email,
								from: 'noreply@gmail.com',
								subject: 'Your webrpg.io password has been changed',
								text: 'Hello,\n\n' +
								'This is a confirmation that the password for your account ' + email + ' has just been changed.\n'
							};
							smtpTransport.sendMail(mailOptions, function(err) {
								if (err) throw err;
							});	
						});
						console.log("forgot POST attempt success");
						//TODO: log the user in and send them to the main page with a logout link instead of the login link
						res.redirect("/?forgot_post_success");
						return;
						return;
					} else {
						//update token and expiration to undefined
						var sql = "UPDATE users SET resetPasswordToken = '" + undefined + "', resetPasswordExpires = '" + undefined + "' WHERE id = " + db.escape(results[0].id);
						query = db.query(sql, function(err, results) {
							if (err) throw err;
						});
						console.log("forgot POST attempt error");
						res.redirect("/?forgot_post_error=Token Timed Out");
						return;
					}
				} else {
					console.log("forgot POST attempt error");
					res.redirect("/?forgot_post_error=Token Doesnt Exist");
					return;
				}
			});
		} else {
			res.redirect("/");
			return;
		}
		//Forgot GET response
	// } else if(req.method == "GET" && req.params.token == ".well-known"){
		// console.log("redirecting to .well-known");
		// res.redirect("public/.well-known");
	} else if(req.method == "GET" && req.params.token.length == 40){
		console.log("forgot GET token attempt by " + req.params.token);
		var token = req.params.token;
		if(token.length == 40) {
			var sql = "SELECT * FROM `users` WHERE `resetPasswordToken`=" + db.escape(token);
			
			var query = db.query(sql, function(err, results) {
				if (err) throw err;
				if(results.length == 1) {
					//check if the time has passed or not
					var date1 = new Date(results[0].resetPasswordExpires);
					var date2 = Date.now();
					if(date2 < date1) {
						res.redirect("/?forgot_get_success=" + req.params.token);
						return;
					} else {
						//update token and expiration to undefined
						var sql = "UPDATE users SET resetPasswordToken = '" + undefined + "', resetPasswordExpires = '" + undefined + "' WHERE id = " + db.escape(results[0].id);
						query = db.query(sql, function(err, results) {
							if (err) throw err;
						});
						res.redirect("/?forgot_get_error");
						return;
					}
				} else {
					res.redirect("/?forgot_get_error");
					return;
				}
			});
		} else {
			res.redirect("/");
			return;
		}
	} else {
		// res.sendFile( __dirname + "/" + req.params.token );  
		console.log("MAJOR ERROR");
	}
};

//------------------------------------logout functionality----------------------------------------------
exports.logout=function(req,res){
	req.session.destroy(function(err) {
		res.redirect("/?logout");
		return;
	})
};