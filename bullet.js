var Bullet = function(x, y, direction)
{
	this.image = document.createElement("img");

	this.direction = direction;
 	
	this.position = new Vector2(x, y+ 10);
	this.position.Set(x,y + 10)
	this.positionLeft = new Vector2(x+28, y+ 10);
	this.positionLeft.Set(x +28 ,y+ 10)
	this.positionRight = new Vector2(x +10 , y+ 10);
	this.positionRight.Set(x +10 ,y+10)
	this.velocity = new Vector2();
    this.image.src = "bullet.png"
	this.boneshardEmitter = createBoneShardEmitter("boneshard.png", (this.position.x, this.position.y));
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
	this.boneshardEmitter.update(deltaTime);
}

Bullet.prototype.draw = function()
{

	context.drawImage(this.image,this.position.x - worldOffsetX, this.position.y);
}