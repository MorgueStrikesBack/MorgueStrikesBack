var Bullet = function(x, y, left, right)
{
	this.sprite = new Sprite("bullet.png");
	this.sprite.buildAnimation(1, 1, 32, 32, -1, [0]);
	this.sprite.setAnimationOffset(0, 0, 0);
	this.sprite.setLoop(0, false);

	this.position = new Vector2();

	this.velocity = new Vector2();
	this.left = left;
	this.right = right;

	if(this.right == true)
	{
		this.velocity.Set(MAXDX * 2, 0);
	}
	else if(this.left == true)
	{
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