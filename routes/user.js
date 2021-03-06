const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const async = require('async-waterfall');
require('dotenv').config();
const request = require('request');

var Recaptcha = require('express-recaptcha').Recaptcha;
// var recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY);


var salt_factor = 12;
var recaptcha_check = false;
var recaptcha_failed = false;
//------------------------------------login/signup/forgot password functionality----------------------------------------------
exports.index = function(req, res) {
	//reCaptcha code
	recaptcha_check = false;
	recaptcha_failed = false;
	if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
		recaptcha_check = true;
	}
	const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + process.env.RECAPTCHA_SECRET_KEY + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
	request(verificationURL,function(error,response,body) {
		body = JSON.parse(body);
		if(body.success !== undefined && !body.success) {
			recaptcha_failed = true;
		}
	});
	
	//User signup response
    if(req.method == "POST" && req.body.signup_email != undefined) {
		console.log("signup attempt by '" + req.body.signup_email + "'");
		if(recaptcha_check){
			recaptcha_check = false;
			res.redirect("/?recaptcha_error=Please select captcha first");
			return;
		}
		if(recaptcha_failed){
			recaptcha_failed = false;
			res.redirect("/?recaptcha_failed=Failed captcha verification");
			return;
		}
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
			if(results.length == 1) {
				console.log("account for '" + email + "' already exists");
				res.redirect('/?signup_error=' + "account for '" + email + "' already exists");
				return;
			} else {
				//If email is unique then enter in the new account
				var salt = bcrypt.genSaltSync(salt_factor);
				pass = bcrypt.hashSync(pass,salt);
				
				var sql = "INSERT INTO `users` (`email`, `password`, `resetPasswordToken`, `resetPasswordExpires`, `crpToken`, `loggedIn`, `socket`, `emailValidationToken`, `emailValidationExpires`, `validated`) VALUES (" + db.escape(email) + "," + db.escape(pass) + ",'" + undefined + "','" + undefined + "','" + undefined + "','" + 0 + "','" + null + "','" + undefined + "','" + undefined + "','" + 0 + "')";
				//TODO: Insert a new row into the player_settings table with all default settings for this new account.
				var query = db.query(sql, function(err, results) {
					if (err) throw err;
					if(results.affectedRows == 1) {
						//TODO: send email with a validation link to validate
						//the account. Display messsage to check email for 
						//validation email before logging in.
						async([
							function(done) {
								crypto.randomBytes(20, function(err, buf) {
									token = buf.toString('hex');
									done(err, token);
								});
							},
							function(token,done) {
								date = Date.now() + 86400000; // 24 hours
						
								var d = new Date(date);
								dformat = [d.getFullYear(),
										   d.getMonth()+1,
										   d.getDate()].join('-')+' '+
										  [d.getHours(),
										   d.getMinutes(),
										   d.getSeconds()].join(':');
										   
								var sql = "UPDATE users SET emailValidationExpires = " + db.escape(dformat) + ", emailValidationToken = " + db.escape(token) + " WHERE email = " + db.escape(email);
								var query = db.query(sql, function(err, results) {
									if (err) throw err;
									if(results.affectedRows == 1) {
										var smtpTransport = nodemailer.createTransport({
											host: process.env.EMAIL_HOST,
											port: process.env.EMAIL_PORT,
											secure: true, // use SSL
											auth: {
												user: process.env.EMAIL_ADDRESS,
												pass: process.env.EMAIL_PASSWORD
											}
										});
										var mailOptions = {
											to: email,
											from: 'noreply@webrpg.io',
											subject: 'webrpg.io Email Validation',
											text: 'You are receiving this because you (or someone else) have signed up for an account on webrpg.io.\n\n' +
											  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
											  'https://' + req.headers.host + '/email_validation=' + token + '\n\n' +
											  'If you did not request this, please ignore this email.\n'
										};
										smtpTransport.sendMail(mailOptions, function(err, info) {
											if (err) throw err;
										});
									}
								});
							}
						]);
						
						console.log("'" + email + "' successfully signup");
						
						res.redirect('/?signup_success=Please check your email to activate your account');
						return;
					} else {
						console.log("'" + email + "' un-successfully signup could not insert into database");
						res.redirect('/?signup_error=Our Error Please Contact support@webrpg.io');
						return;
					}
				});
			}
		});
	//User Login response
	} else if(req.method == "POST" && req.body.login_email != undefined) {
		console.log("login attempt by '" + req.body.login_email + "'");
		if(recaptcha_check){
			recaptcha_check = false;
			res.redirect("/?recaptcha_error=Please select captcha first");
			return;
		}
		if(recaptcha_failed){
			recaptcha_failed = false;
			res.redirect("/?recaptcha_failed=Failed captcha verification");
			return;
		}
		var post = req.body;
		var email = post.login_email;
		var pass = post.password;
		//TODO: check if account has been validated else display
		//error message stating the account still needs to be validate
		var sql="SELECT `id`, `email`, `password`, `loggedIn`, `validated` FROM `users` WHERE `email`="+db.escape(email);                           
		
		db.query(sql, function(err, results){ 
			if (err) throw err;
			if(results.length == 1){
				if(!results[0].validated) {
					console.log("'" + results[0].email + "' account not validated");
					res.redirect('/?login_error=Please check your email and click the validation link provided&email=' + email);
					return;
				}
				if(results[0].loggedIn) {
					console.log("'" + results[0].email + "' already logged in");
					res.redirect('/?login_error=Already logged in&email=' + email);
					return;
				}
				if(bcrypt.compareSync(pass, results[0].password)) {
					req.session.userId = results[0].id;
					req.session.user = results[0];
					console.log("'" + results[0].email + "' successfully logged in");
					var token;
					async([
						function(done) {
							crypto.randomBytes(20, function(err, buf) {
								token = buf.toString('hex');
								done(err, token);
							});
						},
						function(token,done) {
							var sql = "UPDATE users SET crpToken = " + db.escape(token) + " WHERE id = " + db.escape(results[0].id);
							var query = db.query(sql, function(err, results) {
								if (err) throw err;
								if(results.affectedRows == 1) {
									console.log("Successfully updated MySQL with CRP token");
									res.redirect('/?login_success&crptoken=' + token);
									return;
								}
								else {
									console.log("Error updating MySQL with CRP token");
								}
							});
						},
					]);
				} else {
					console.log("'" + results[0].email + "' password incorrect");
					res.redirect('/?login_error=Email or password mismatched&email=' + email);
					return;
				}
			}
			else{
				console.log("'" + email + "' un-successfully login");
				res.redirect('/?login_error=Account does not exist for ' + email + '&email=' + email);
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
			if(results.length == 1) {
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
									host: process.env.EMAIL_HOST,
									port: process.env.EMAIL_PORT,
									secure: true, // use SSL
									auth: {
										user: process.env.EMAIL_ADDRESS,
										pass: process.env.EMAIL_PASSWORD
									}
								});
								var mailOptions = {
									to: email,
									from: process.env.EMAIL_ADDRESS,
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
								res.redirect('/?forgot_error=Could not find account for email: ' + email);
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
								host: process.env.EMAIL_HOST,
								port: process.env.EMAIL_PORT,
								secure: true, // use SSL
								auth: {
									user: process.env.EMAIL_ADDRESS,
									pass: process.env.EMAIL_PASSWORD
								}
							});
							var mailOptions = {
								to: email,
								from: 'noreply@webrpg.io',
								subject: 'Your webrpg.io password has been changed',
								text: 'Hello,\n\n' +
								'This is a confirmation that the password for your account ' + email + ' has just been changed.\n'
							};
							smtpTransport.sendMail(mailOptions, function(err) {
								if (err) throw err;
								console.log("successfully sent email to: " + email);
							});	
						});
						console.log("forgot POST attempt success");
						//TODO: log the user in and send them to the main page with a logout link instead of the login link
						res.redirect("/?forgot_post_success");
						return;
					} else {
						//update token and expiration to undefined
						var sql = "UPDATE users SET resetPasswordToken = '" + undefined + "', resetPasswordExpires = '" + undefined + "' WHERE id = " + db.escape(results[0].id);
						query = db.query(sql, function(err, results) {
							if (err) throw err;
							console.log("successfully updated resetPasswordToken and resetPasswordExpires to null");
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
			console.log("token length is incorrect");
			res.redirect("/");
			return;
		}
		//Forgot GET response
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
							console.log("successfully updated resetPasswordToken and resetPasswordExpires to null");
						});
						console.log("date has expired");
						res.redirect("/?forgot_get_error");
						return;
					}
				} else {
					console.log("could not find record in database");
					res.redirect("/?forgot_get_error");
					return;
				}
			});
		} else {
			console.log("Token not the right length");
			res.redirect("/");
			return;
		}
	} else if(req.method == "GET" && req.params.token.includes("email_validation")){
		var token = req.params.token.split(/[=,&]+/)[1];
		console.log("email_validation GET token attempt by " + token);
		//TODO Select from db and check if the expiration date has passed or not
		//then update accordingly.
		var sql = "SELECT * FROM `users` WHERE `emailValidationToken`=" + db.escape(token);
			
		var query = db.query(sql, function(err, results) {
			if (err) throw err;
			if(results.length == 1 || token.length  != 40) {
				//check if the time has passed or not
				var date1 = new Date(results[0].emailValidationExpires);
				var date2 = Date.now();
				if(date2 < date1) {
					//Set validation to 1 to validate the users account
					var sql = "UPDATE users SET emailValidationExpires = '" + null + "', emailValidationToken = '" + null + "', validated = '" + 1 + "' WHERE emailValidationToken = " + db.escape(token);
		
					var query = db.query(sql, function(err, results) {
						if (err) throw err;
						if(results.affectedRows == 1) {
							console.log("Account validation success for: " + token)
							res.redirect("/?signup_success=Your account is now activated");
							return;
						} else {
							console.log("signup_error could not update emailValidationToken or validated");
							res.redirect("/?signup_error=Token is invalid or has expired");
							return;
						}
					});
				} else {
					//update token and expiration to undefined
					var sql = "UPDATE users SET emailValidationExpires = '" + null + "', emailValidationToken = '" + null + " WHERE emailValidationToken = " + db.escape(token);
					query = db.query(sql, function(err, results) {
						if (err) throw err;
						console.log("updated emailValidationExpires and emailValidationToken");
					});
					res.redirect("/?signup_error=Token is invalid or has expired");
					return;
				}
			} else {
				console.log("email validation error: " + token);
				res.redirect("/?signup_error=validation error please contact support@webrpg");
				return;
			}
		});
	} else if(req.method == "POST" && req.body.feedback_email != undefined) {
		if(recaptcha_check){
			recaptcha_check = false;
			res.redirect("/?recaptcha_error=Please select captcha first");
			return;
		}
		if(recaptcha_failed){
			recaptcha_failed = false;
			res.redirect("/?recaptcha_failed=Failed captcha verification");
			return;
		}
		var name = req.body.name;
		var email = req.body.feedback_email;
		var message = req.body.comment;
		var smtpTransport = nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			secure: true, // use SSL
			auth: {
				user: process.env.FEEDBACK_EMAIL_ADDRESS,
				pass: process.env.EMAIL_PASSWORD
			}
		});
		var mailOptions = {
			to: process.env.FEEDBACK_EMAIL_ADDRESS,
			from: process.env.FEEDBACK_EMAIL_ADDRESS,
			subject: 'Feedback from ' + name,
			text: email + '\n\n' + message
		};
		smtpTransport.sendMail(mailOptions, function(err, info) {
			if (err) throw err;
		});
		console.log("'" + email + "' successfully sent feedback");
		res.redirect('/?feedback_success');
	} else {
		//do a dump of these: req, res
		console.log("404 ERROR");
		res.redirect('/404.html');
	}
};