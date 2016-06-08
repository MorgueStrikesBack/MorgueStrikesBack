var Bullet = function(x, y, direction)
{
	this.image = document.createElement("img");

	this.direction = direction;

	this.position = new Vector2(x, y);
	this.positionLeft = new Vector2(x + 60, y);
	this.positionRight = new Vector2(x - 60, y);
	this.velocity = new Vector2();
    this.image.src = "bullet.png"

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

	this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
}

Bullet.prototype.draw = function()
{

	context.drawImage(this.image,this.position.x - worldOffsetX, this.position.y);
}