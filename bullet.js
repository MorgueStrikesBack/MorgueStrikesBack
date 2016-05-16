var Bullet = function(x, y, direction)
{
	this.sprite = new Sprite("bullet.png");
	this.sprite.buildAnimation(1, 1, 32, 32, -1, [0]);
	this.sprite.setAnimationOffset(0, 0, 0);
	this.sprite.setLoop(0, false);


	this.direction = direction;

	this.position = new Vector2(x, y);
	this.positionLeft = new Vector2(x + 60, y);
	this.positionRight = new Vector2(x - 60, y);
	this.velocity = new Vector2();


	if(this.direction == 1)
	{
		this.position.x = this.positionLeft.x
		this.velocity.Set(MAXDX * 2, 0);
	}
	else if(this.direction == 0)
	{
		this.position.x = this.positionRight.x
		this.velocity.Set(-MAXDX * 2, 0);
	}
}

Bullet.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
}

Bullet.prototype.draw = function()
{
	var screenX = this.position.x - worldOffsetX;
	this.sprite.draw(context, screenX, this.position.y);
}