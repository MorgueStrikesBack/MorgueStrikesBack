
var GameState = function() 
{
	this.prototype = BaseState;
}

GameState.prototype.load = function() 
{
	this.delay = 2;
}

GameState.prototype.unload = function() 
{
}

GameState.prototype.update = function(dt) 
{
	if( this.delay > 0 )
		this.delay -= dt;
}

GameState.prototype.draw = function() 
{	
	if( this.delay <= 0 )
	{
		var deltaTime = getDeltaTime();

		player.update(deltaTime);
    	drawMap(deltaTime);
    	//drawMap();
    	player.draw();

    	for(var i=0; i<bullets.length; i++)
		{
			bullets[i].update(deltaTime);

		}

		for(var i=0; i<bullets.length; i++)
		{
			bullets[i].draw();
		}

		if(player.cooldownTimer >= 0)	
			player.cooldownTimer -= deltaTime
	}
	else 
	{
		context.font="72px Verdana";	
		context.fillStyle = "#FF0";	
		var width =  context.measureText("GET READY").width;
		context.fillText("GET READY", SCREEN_WIDTH/2 - width/2, SCREEN_HEIGHT/2);

		var time = Math.floor(this.delay);
		var decimal = Math.floor(this.delay * 10) - time*10;
	
		context.font="18px Verdana";	
		context.fillStyle = "#000";		
		width = context.measureText(time + "." + decimal).width;
		context.fillText(time + "." + decimal, SCREEN_WIDTH/2 - width/2, 300);
	}
}