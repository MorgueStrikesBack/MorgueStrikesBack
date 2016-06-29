
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
	{
		this.delay -= dt;
	}
	else
	{
		player.update(dt);
		var hit = false
		for(var i=0; i<bullets.length; i++)
		{
			bullets[i].update(dt);


			for(var j=0; j<enemies.length; j++)
			{
				if(intersects( bullets[i].position.x -worldOffsetX, bullets[i].position.y, TILE, TILE, enemies[j].position.x-worldOffsetX, enemies[j].position.y, TILE, TILE) == true)
				{

				// kill both the bullet and the enemy

					enemies.splice(j, 1);			



				hit = true;
				// increment the player score
				
				break;
				}
			}
			if(hit == true)
			{
		
				bullets.splice(i, 1);
				break;
			}
		}
}

		for(var i=0; i<enemies.length; i++)
		{
			enemies[i].update(dt);

		}

		if(player.cooldownTimer >= 0){
			player.cooldownTimer -= dt
		}
}

GameState.prototype.draw = function() 
{	
	if( this.delay <= 0 )
	{
		
    	drawMap();

		for(var i=0; i<lives; i++)
		{
			context.drawImage(livesImage, 20 + ((livesImage.width+2)*i), 10);
		}

		for(var i=0; i<ammo; i++)
		{
			context.drawImage(ammoImage, 30 + ((ammoImage.width+2)*i), 40);
		}

    	player.draw();

		for(var i=0; i<enemies.length; i++)
		{
			enemies[i].draw();

		}


		for(var i=0; i<bullets.length; i++)
		{
			bullets[i].draw();
		}
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