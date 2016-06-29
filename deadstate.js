
var DeadState = function() 
{
	this.prototype = BaseState;
}

DeadState.prototype.load = function() 
{
}

DeadState.prototype.unload = function() 
{
}

DeadState.prototype.update = function(dt) 
{
	if( keyboard.isKeyDown( keyboard.KEY_E ) == true )
	{
		stateManager.switchState( new GameState() );
	}
}

DeadState.prototype.draw = function() 
{
	context.font="72px Verdana";	
	context.fillStyle = "#FF0";	
	var width =  context.measureText("YOU DIED").width;
	context.fillText("YOU DIED", SCREEN_WIDTH/2 - width/2, SCREEN_HEIGHT/2);		
	
	context.font="18px Verdana";	
	context.fillStyle = "#000";	
	width =  context.measureText("Press E to Try Again.").width;
	context.fillText("Press E to Try Again.", SCREEN_WIDTH/2 - width/2, 300);
}