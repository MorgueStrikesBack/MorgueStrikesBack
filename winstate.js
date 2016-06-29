
var WinState = function() 
{
}

BaseState.prototype.load = function() 
{
}

BaseState.prototype.unload = function() 
{
}

BaseState.prototype.update = function(dt) 
{
}

BaseState.prototype.draw = function() 
{
	context.font="72px Verdana";	
	context.fillStyle = "#FF0";	
	var width =  context.measureText("CONGRATULATIONS").width;
	context.fillText("CONGRATULATIONS", SCREEN_WIDTH/2 - width/2, SCREEN_HEIGHT/2);

	context.font="18px Verdana";	
	context.fillStyle = "#000";	
	width =  context.measureText("YOU HAVE WON!").width;
	context.fillText("YOU HAVE WON!", SCREEN_WIDTH/2 - width/2, 300);
}