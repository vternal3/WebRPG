$(function () {
	var socket = io();
	$('form').submit(function(){
		socket.emit('chat message', $('#nickname').val());
		$('#nickname').val('');
		return false;
	});
	socket.on('chat message', function(msg){
		$('#messages').append($('<li>').text(msg));
	});
});