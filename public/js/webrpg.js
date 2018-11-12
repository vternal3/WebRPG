//Prevent the enter key from being pressed.
$(document).keypress(
  function(event){
    if (event.which == '13') {
      event.preventDefault();
    }
});

//prevents form submit from refreshing page.
$("#login_form").submit(function(e) {
    e.preventDefault(); 
});

jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: false
    });
}

function start(name)
{
	document.getElementById("login").classList.add("nodisplay");
	document.getElementById("top_left_overlay").classList.add("nodisplay");
	document.getElementById("top_right_overlay").classList.add("nodisplay");
	document.getElementById("bottom_right_overlay").classList.add("nodisplay");
	document.getElementById("bottom_left_overlay").classList.add("nodisplay");
	document.getElementById("bottom_middle_overlay").classList.add("nodisplay");
	if(document.getElementsByClassName("addthis-smartlayers-desktop")[0]) {
		document.getElementsByClassName("addthis-smartlayers-desktop")[0].classList.add("nodisplay");
	}
	document.getElementById("feedback_button").classList.add("nodisplay");
	
	//Sleep for a second to let the main page fade out.
	//TODO: make this div fade in eventually
	setTimeout(function() {
		document.getElementById("game_canvas").style.display = "initial";
	}, 600);
	//Loads the client game script dynamically
	$.loadScript('js/character_scene.js', function(){
	});
	$.loadScript('js/settings_scene.js', function(){
	});
	$.loadScript('js/game_scene.js', function(){
	});
	$.loadScript('js/title_scene.js', function(){
	});
	$.loadScript('js/loading_scene.js', function(){
	});
	$.loadScript('js/client.js', function(){
	});
}

function login_form_update()
{
	document.getElementById("signupform").style.display = "none";
	document.getElementById("loginform").style.display = "initial";
	if(document.getElementById("forgot-email").value != "") {
		document.getElementById("login_email").value = document.getElementById("forgot-email").value;
	}
	document.getElementById("forgotform").style.display = "none";
	document.getElementById("forgot_new_password").style.display = "none";
	document.getElementById("forgot_succeed").style.display = "none";
	document.getElementById("feedback_succeed").style.display = "none";
	document.getElementById("login_message").innerHTML = "";
	document.getElementById("recaptcha_error_label").style.display = "none";
}

function signup_form()
{
	document.getElementById("signupform").style.display = "initial";
	document.getElementById("loginform").style.display = "none";
	document.getElementById("forgotform").style.display = "none";
	document.getElementById("forgot_new_password").style.display = "none";
	document.getElementById("forgot_succeed").style.display = "none";
	document.getElementById("feedback_succeed").style.display = "none";
	document.getElementById("signup_message").innerHTML = "";
	document.getElementById("recaptcha_error_label").style.display = "none";
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
	document.getElementById("feedback_succeed").style.display = "none";
	document.getElementById("forgot_message").innerHTML = "";
	document.getElementById("recaptcha_error_label").style.display = "none";
}

function forgot_new_password()
{
	document.getElementById("signupform").style.display = "none";
	document.getElementById("loginform").style.display = "none";
	document.getElementById("forgotform").style.display = "none";
	document.getElementById("forgot_new_password").style.display = "initial";
	document.getElementById("forgot_succeed").style.display = "none";
	document.getElementById("feedback_succeed").style.display = "none";
	document.getElementById("forgot_new_password_message").innerHTML = "";
	document.getElementById("recaptcha_error_label").style.display = "none";
}

$(document).ready(function(){
	//Login failed
	if(window.location.href.includes("login_error")) {
		var message = window.location.href.split(/[=,&]+/)[1];
		message = message.replace(/%20/g, " ");
		var email = window.location.href.split(/[=,&]+/)[3];
		document.getElementById("login_form_link").click();
		document.getElementById("login_email").value = email;
		document.getElementById("login_message").innerHTML = "<span style='color:red;'>" + message + "</span>";
		window.history.pushState("object or string", "Clear return params", "/#");
	} else {
		document.getElementById("login_message").innerHTML = "";
	}
	//Login succeeded
	if(window.location.href.includes("login_success")) {
		var crpToken = window.location.href.split(/[=,&]+/)[2];
		start(crpToken);
	}
	//Signup failed
	if(window.location.href.includes("signup_error")) {
		var message = window.location.href.split(/[=,&]+/)[1];
		message = message.replace(/%20/g, " ");
		message = message.replace(/%27/g, "'");
		document.getElementById("signup_form_link").click();
		document.getElementById("signup_message").innerHTML = "<span style='color:red;'>" + message + "</span>";
		window.history.pushState("object or string", "Clear return params", "/#");
	} else {
		document.getElementById("signup_message").innerHTML = "";
	}
	//Signup succeeded
	if(window.location.href.includes("signup_success")) {
		var message = window.location.href.split(/[=,&]+/)[1];
		message = message.replace(/%20/g, " ");
		document.getElementById("signup_form_link").click();
		document.getElementById("signup_message").innerHTML = "<span style='color:green;'>" + message + "</span>";
		window.history.pushState("object or string", "Clear return params", "/#");
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
		document.getElementById("forgot_new_password_message").innerHTML = "<span style='color:green;'>Please enter a new password</span>";
		window.history.pushState("object or string", "Clear return params", "/#" + token);
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
	//Recaptcha not filled out
	if(window.location.href.includes("recaptcha_error")) {
		
		var message = window.location.href.split(/[=,&]+/)[1];
		message = message.replace(/%20/g, " ");
		document.getElementById("recaptcha_error_label").innerHTML = "<span style='color:red;'>" + message + "</span>";
		window.history.pushState("object or string", "Clear return params", "/#");
	}
	//Recaptcha validation failed
	if(window.location.href.includes("recaptcha_failed")) {
		
		var message = window.location.href.split(/[=,&]+/)[1];
		message = message.replace(/%20/g, " ");
		document.getElementById("recaptcha_error_label").innerHTML = "<span style='color:red;'>" + message + "</span>";
		window.history.pushState("object or string", "Clear return params", "/#");
	}
	if(window.location.href.includes("feedback_success")) {
		document.getElementById("feedback_succeed").style.display = "initial";
		document.getElementById("feedback_succeed_label").innerHTML = "<span style='color:green;'>Thank you for your feedback</span>";
		window.history.pushState("object or string", "Clear return params", "/#");
	}
	//set token which should be the 3rd=2 element split from '/'s 
	document.getElementById('forgot_password_form').action = "/" + window.location.href.split(/[\/]+/)[2];
	
});