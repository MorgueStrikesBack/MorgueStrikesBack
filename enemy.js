
var Enemy = function() {
	this.image = document.createElement("img");
	this.position = new Vector2(58,58)
	this.width = 64;
	this.height = 56;
	this.image.src = "Enemy.png"; 
};

Enemy.prototype.update = function(deltaTime)
{
	if( typeof(this.rotation) == "undefined" )
		this.rotation = 0; 
	if(keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
	{
		this.rotation -= deltaTime;
	}
	else
	{
		this.rotation += deltaTime;
	}
}

Enemy.prototype.draw = function()
{
	context.save();
		context.translate(this.position.x, this.position.y);
		context.rotate(this.rotation);
		context.drawImage(this.image, -this.width/2, -this.height/2);
	context.restore();
}