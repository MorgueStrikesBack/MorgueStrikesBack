//Constants
var LEFT = 0;
var RIGHT = 1;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;

var ANIM_IDLE_RIGHT = 3;
var ANIM_JUMP_RIGHT = 4;
var ANIM_WALK_RIGHT = 5;

var ANIM_CLIMB = 6;

var ANIM_SHOOT_LEFT = 7;
var ANIM_SHOOT_RIGHT = 8;

var PLAYER_ANIM_MAX = 9;


var Player = function() {
	this.sprite = new Sprite("Hero.png");
	
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[0, 1, 2, 3, 4, 5, 6, 7]);
	
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[8, 9, 10, 11, 12]);
	
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
	
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[52, 53, 54, 55, 56, 57, 58, 59]);
	
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[60, 61, 62, 63, 64]);
	
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);

	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[41, 42, 43, 44, 45, 46, 47, 48, 49, 51]);
	
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[27, 28 ,29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]);
	
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92]);
	
	for(var i=0; i<PLAYER_ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -55, -87);
	}

	this.position = new Vector2(50, canvas.height/2)
	this.startPos = new Vector2(50, canvas.height/2)
	this.sprite.x = this.position.x
	this.sprite.y = this.position.y
	this.velocity = new Vector2(0,0)


	this.width = 159;
	this.height = 163;

	this.falling = true;
	this.jumping = false;

	this.direction = LEFT;

	this.cooldownTimer = 0;

	this.isDead = false;
};

Player.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);

	var left = false;
	var right = false;
	var jump = false;

	// check keypress events
	if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true) 
	{
		left = true;
		this.direction = LEFT;
		if(this.sprite.currentAnimation != ANIM_WALK_LEFT  && this.jumping == false)
			this.sprite.setAnimation(ANIM_WALK_LEFT);
	}
	else if(keyboard.isKeyDown(keyboard.KEY_RIGHT) == true) 
	{
		right = true;
		this.direction = RIGHT;
		if(this.sprite.currentAnimation != ANIM_WALK_RIGHT && this.jumping == false)
			this.sprite.setAnimation(ANIM_WALK_RIGHT);
		//console.log(this.sprite.currentAnimation)
	}
	else
	{
		if(this.jumping == false && this.falling ==false)
		{
			if(this.direction == LEFT)
			{
				if(this.sprite.currentAnimation != ANIM_IDLE_LEFT)
					this.sprite.setAnimation(ANIM_IDLE_LEFT);
			}
			else
			{
				if(this.sprite.currentAnimation != ANIM_IDLE_RIGHT)
					this.sprite.setAnimation(ANIM_IDLE_RIGHT);
			}
		}
	}

	if(keyboard.isKeyDown(keyboard.KEY_UP) == true) 
	{
		jump = true;

		if(left == true)
		{
				this.sprite.setAnimation(ANIM_JUMP_LEFT)
		}

		if(right == true)
		{
			this.sprite.setAnimation(ANIM_JUMP_RIGHT)
		}
	}

	if(this.cooldownTimer>0)
	{
		this.cooldownTimer -= deltaTime;
	}

	if(keyboard.isKeyDown(keyboard.KEY_SHIFT) == true && this.cooldownTimer <= 0)
	{
		sfxFire.play();
		this.cooldownTimer = 0.3;
		// Shoot a bullet

		bullets.push(new Bullet(this.position.x,this.position.y,this.direction))

	}


	var wasLeft = this.velocity.x < 0;
	var wasRight = this.velocity.x > 0;
	var falling = this.falling;
	var ddx = 0; // acceleration
	var ddy = GRAVITY;

	if (left)
		ddx = ddx - ACCEL; // player wants to go left
	else if (wasLeft)
	 	ddx = ddx + FRICTION; // player was going left, but not any more

	if (right)
		ddx = ddx + ACCEL; // player wants to go right
	else if (wasRight)
	 	ddx = ddx - FRICTION; // player was going right, but not any more

	if (jump && !this.jumping && !falling)
	{
		ddy = ddy - JUMP; // apply an instantaneous (large) vertical impulse
		sfxJump.play();		
		this.jumping = true;
		if(this.direction == LEFT)
			this.sprite.setAnimation(ANIM_JUMP_LEFT)
		else
			this.sprite.setAnimation(ANIM_JUMP_RIGHT)

	}
	// calculate the new position and velocity:
	this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));

	this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);
	this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);
 
 	if ((wasLeft && (this.velocity.x > 0)) || (wasRight && (this.velocity.x < 0)))
 	{
 		// clamp at zero to prevent friction from making us jiggle side to side
 		this.velocity.x = 0;
 	}

 	// collision detection
	// Our collision detection logic is greatly simplified by the fact that the player is a rectangle
	// and is exactly the same size as a single tile. So we know that the player can only ever
	// occupy 1, 2 or 4 cells.
	
	// This means we can short-circuit and avoid building a general purpose collision detection
	// engine by simply looking at the 1 to 4 cells that the player occupies:
	var tx = pixelToTile(this.position.x);
	var ty = pixelToTile(this.position.y);

	var nx = (this.position.x)%TILE; // true if player overlaps right
	var ny = (this.position.y)%TILE; // true if player overlaps below

	var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
	var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
	var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
	var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);

	// If the player has vertical velocity, then check to see if they have hit a platform
	// below or above, in which case, stop their vertical velocity, and clamp their
	// y position:
	if (this.velocity.y > 0)
	{
		if ((celldown && !cell) || (celldiag && !cellright && nx)) 
		{
			// clamp the y position to avoid falling into platform below
			this.position.y = tileToPixel(ty);
			this.velocity.y = 0; // stop downward velocity
			this.falling = false; // no longer falling
			this.jumping = false; // (or jumping)
			ny = 0; // no longer overlaps the cells below
		}
		else if (this.velocity.y < 0) 
		{
			if ((cell && !celldown) || (cellright && !celldiag && nx))
			{
			// clamp the y position to avoid jumping into platform above
			this.position.y = tileToPixel(ty + 1);
			this.velocity.y = 0; // stop upward velocity
			// player is no longer really in that cell, we clamped them to the cell below
			cell = celldown;
			cellright = celldiag; // (ditto)
			ny = 0; // player no longer overlaps the cells below
			}
		}
		if (this.velocity.x > 0) 
		{
			if ((cellright && !cell) || (celldiag && !celldown && ny)) 
			{
				// clamp the x position to avoid moving into the platform we just hit
				this.position.x = tileToPixel(tx);
				this.velocity.x = 0; // stop horizontal velocity
			}
		}
		else if (this.velocity.x < 0)
		{
			if ((cell && !cellright) || (celldown && !celldiag && ny)) 
			{
				// clamp the x position to avoid moving into the platform we just hit
				this.position.x = tileToPixel(tx + 1);
				this.velocity.x = 0; // stop horizontal velocity
			}
		}
	}


	if (this.direction == LEFT)
	{
		this.sprite.x = this.position.x - 20
		this.sprite.y = this.position.y
	}
	else 
	{
		this.sprite.x = this.position.x
		this.sprite.y = this.position.y
	}


}

Player.prototype.draw = function()
{
	this.sprite.draw(context, this.sprite.x - worldOffsetX, this.sprite.y);

	/*context.fillStyle = "blue"
	context.fillRect(this.position.x, this.position.y, 35, 35)*/
}