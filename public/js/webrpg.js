var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 320;

var canvasElement = $("<canvas width='" + CANVAS_WIDTH + 
                      "' height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");

canvas.canvas.width = window.innerWidth;
canvas.canvas.height = window.innerHeight;

canvasElement.insertBefore('#container');

window.addEventListener('resize', resizeCanvas, false);

// Runs each time the DOM window resize event fires.
// Resets the canvas dimensions to match window
function resizeCanvas() {
	canvas.canvas.width = window.innerWidth;
	canvas.canvas.height = window.innerHeight;
}

var FPS = 30;
var player = {
	color: "#00A",
	x: 50,
	y: 270,
	width: 20,
	height: 30,
	draw: function() {
		canvas.fillStyle = this.color;
		canvas.fillRect(this.x, this.y, this.width, this.height);
	}
};

//prevents form submit from refreshing page.
$("#login_form").submit(function(e) {
    e.preventDefault(); 
});

setInterval(function() {
	update();
	draw();
}, 1000/FPS);

var nickname = "";
function start(name)
{
	if(name == "")
		nickname = document.getElementById("nickname").value;
	else
		nickename = name;
	document.getElementById("login").classList.add("nodisplay");
	document.getElementById("top_left_overlay").classList.add("nodisplay");
	document.getElementById("top_right_overlay").classList.add("nodisplay");
	document.getElementById("bottom_right_overlay").classList.add("nodisplay");
	document.getElementById("bottom_left_overlay").classList.add("nodisplay");
	document.getElementById("bottom_middle_overlay").classList.add("nodisplay");
	document.getElementById("test").innerHTML = nickename;
	window.history.pushState("object or string", "Clear return params", "/#");
	
}

function login_form()
{
	document.getElementById("signupform").style.display = "none";
	document.getElementById("loginform").style.display = "initial";
	if(document.getElementById("forgot-email").value != "") {
		document.getElementById("login_email").value = document.getElementById("forgot-email").value;
	}
	document.getElementById("forgotform").style.display = "none";
	document.getElementById("forgot_new_password").style.display = "none";
	document.getElementById("forgot_succeed").style.display = "none";
	document.getElementById("login_message").innerHTML = "";
}

function signup_form()
{
	document.getElementById("signupform").style.display = "initial";
	document.getElementById("loginform").style.display = "none";
	document.getElementById("forgotform").style.display = "none";
	document.getElementById("forgot_new_password").style.display = "none";
	document.getElementById("forgot_succeed").style.display = "none";
	document.getElementById("signup_message").innerHTML = "";
}

function forgot_form()
{
	document.getElementById("signupform").style.display = "none";
	document.getElementById("loginform").style.display = "none";
	document.getElementById("forgotform").style.display = "initial";
	if(document.getElementById("login_email").value != "") {
		document.getElementById("forgot-email").value = document.getElementById("login_email").value;
	}
	document.getElementById("forgot_new_password").style.display = "none";
	document.getElementById("forgot_succeed").style.display = "none";
	document.getElementById("forgot_message").innerHTML = "";
}

function forgot_new_password()
{
	document.getElementById("signupform").style.display = "none";
	document.getElementById("loginform").style.display = "none";
	document.getElementById("forgotform").style.display = "none";
	document.getElementById("forgot_new_password").style.display = "initial";
	document.getElementById("forgot_succeed").style.display = "none";
	document.getElementById("forgot_new_password_message").innerHTML = "";
}

function update() {
	
}

function draw() {
  //canvas.fillStyle = "#111"; // Set color to grey
  //canvas.font = '72px Courier New';
  //canvas.fillText("Hello World Dev!", canvas.canvas.width / 2 - 250, 50);
}

function preload() {
	
}

function create() {
	
}

$(document).ready(function(){
	//Login failed
	if(window.location.href.includes("login_error")) {
		var email = window.location.href.split(/[=,&]+/)[2];
		document.getElementById("login_form_link").click();
		document.getElementById("login_email").value = email;
		document.getElementById("login_message").innerHTML = "<span style='color:red;'>incorrect email or password</span>"
		window.history.pushState("object or string", "Clear return params", "/#");
	} else {
		document.getElementById("login_message").innerHTML = "";
	}
	//Login succeeded
	if(window.location.href.includes("login_success")) {
		//fade out main page elements and start the game 
		var username = window.location.href.split(/[=,&]+/)[2];
		window.history.pushState("object or string", "Clear return params", "/#");
		console.log(username);
		start(username);
	}
	//Signup failed
	if(window.location.href.includes("signup_error")) {
		var message = window.location.href.split(/[=,&]+/)[1];
		message = message.replace(/%20/g, " ");
		message = message.replace(/%27/g, "'");
		document.getElementById("signup_form_link").click();
		document.getElementById("signup_message").innerHTML = "<span style='color:red;'>" + message + "</span>"
		window.history.pushState("object or string", "Clear return params", "/#");
	} else {
		document.getElementById("signup_message").innerHTML = "";
	}
	//Signup succeeded
	if(window.location.href.includes("signup_success")) {
		//fade out main page elements and start the game 
		var username = window.location.href.split(/[=,&]+/)[2];
		window.history.pushState("object or string", "Clear return params", "/#");
		console.log(username);
		start(username);
	}
	//Forgot succeeded
	if(window.location.href.includes("forgot_success")) {
		var email = window.location.href.split(/[=,&]+/)[2];
		window.history.pushState("object or string", "Clear return params", "/#");
		document.getElementById("forgot_form_link").click();
		document.getElementById("forgot_message").innerHTML = "<span style='color:green;'>An e-mail has been sent to '" + email + "' with further instructions.</span>";
	}
	//Forgot failed
	if(window.location.href.includes("forgot_error")) {
		var message = window.location.href.split(/[=,&]+/)[1];
		message = message.replace(/%20/g, " ");
		message = message.replace(/%27/g, "'");
		window.history.pushState("object or string", "Clear return params", "/#");
		document.getElementById("forgot_form_link").click();
		document.getElementById("forgot_message").innerHTML = "<span style='color:green;'>" + message + "</span>";
	}
	//Forgot get succeeded
	if(window.location.href.includes("forgot_get_success")) {
		forgot_new_password();
		var token = window.location.href.split(/[=,&]+/)[1];
		window.history.pushState("object or string", "Clear return params", "/" + token);
		document.getElementById("forgot_new_password_message").innerHTML = "<span style='color:green;'>Please enter a new password</span>";
	}
	//Forgot get failed
	if(window.location.href.includes("forgot_get_error")) {
		window.history.pushState("object or string", "Clear return params", "/#");
		document.getElementById("forgot_form_link").click();
		document.getElementById("forgot_message").innerHTML = "<span style='color:red;'>Password reset token is invalid or has expired.</span>";
	}
	//Forgot post succeeded
	if(window.location.href.includes("forgot_post_success")) {
		document.getElementById("forgot_succeed").style.display = "initial";
		document.getElementById("forgot_succeed_label").innerHTML = "<span style='color:green;'>Successfully changed your password</span>";
		window.history.pushState("object or string", "Clear return params", "/#");
	}
	//Forgot post failed
	if(window.location.href.includes("forgot_post_error")) {
		document.getElementById("forgot_succeed").style.display = "none";
		document.getElementById("forgot_succeed_label").innerHTML = "";
		forgot_new_password();
		var message = window.location.href.split(/[=,&]+/)[1];
		message = message.replace(/%20/g, " ");
		var token = window.location.href.split(/[=,&]+/)[2];
		if(token)
			window.history.pushState("object or string", "Clear return params", "/" + token);
		else
			window.history.pushState("object or string", "Clear return params", "/#");
		document.getElementById("forgot_new_password_message").innerHTML = "<span style='color:green;'>" + message + "</span>";
	}
	//set token which should be the 3rd=2 element split from '/'s 
	document.getElementById('forgot_password_form').action = "/" + window.location.href.split(/[\/]+/)[2];
	
});

$( window ).on( "load", function(){
	// var canvas = document.querySelector('#body canvas');
	// canvas.width = 600;
	// console.log("here")
});