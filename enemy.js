var ANIM_MOVING_RIGHT = 0;
var ANIM_MOVING_LEFT = 1;

var ENEMY_ANIM_MAX = 2;



var Enemy = function(x, y) {
	this.sprite = new Sprite("Surgeon.png");
	
	this.sprite.buildAnimation(12, 1, 32, 40, 0.05,
		[0, 1, 2, 3, 4, 5]);

	this.sprite.buildAnimation(12, 1, 32, 40, 0.05,
		[6, 7, 8, 9, 10, 11]);


	

	
	for(var i=0; i<ENEMY_ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -32, -43);
	}

	this.position = new Vector2()
	this.position.Set(x, y)

	this.velocity = new Vector2(0,0)
	
	this.width = 64;
	this.height = 56;

	this.moveRight = true;
	this.pause = 0;

};

Enemy.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
	
	if( this.pause > 0)
	{
		this.pause -= deltaTime;
	}
	else
	{
		var ddx = 0;

		var tx = pixelToTile(this.position.x);
		var ty = pixelToTile(this.position.y);

		var nx = (this.position.x)%TILE; // true if enemy overlaps right
		var ny = (this.position.y)%TILE; // true if enemy overlaps below

		var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
		var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
		var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
		var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);


		if(player.position.x > this.position.x)
		{
			this.moveRight = true;
		}


		if(player.position.x < this.position.x)
		{
			this.moveRight = false;
		}


		if(this.moveRight)
		{
			if(celldiag && !cellright) 
			{
				ddx = ddx + ENEMY_ACCEL;
				this.sprite.setAnimation(ANIM_MOVING_RIGHT);
			}
			else
			{
				this.velocity.x = 0;
				this.moveRight = false;
				this.pause = 0.5;
			}
		}


	

		if(!this.moveRight)
		{
			if(celldown && !cell) 
			{
				ddx = ddx - ENEMY_ACCEL;
				this.sprite.setAnimation(ANIM_MOVING_LEFT);
			}
			else
			{
				this.velocity.x = 0;
				this.moveRight = true;
				this.pause = 0.5;
			}
		}

		this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
		this.velocity.x =bound(this.velocity.x + (deltaTime * ddx),-ENEMY_MAXDX, ENEMY_MAXDX);
	}
}

Enemy.prototype.draw = function()
{
this.sprite.draw(context, this.position.x - worldOffsetX, this.position.y);

}

