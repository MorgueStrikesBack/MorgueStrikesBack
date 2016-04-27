var ANIM_MOVING = 0;
var ANIM_DYING = 1;

var ANIM_MAX = 2;

var Enemy = function() {
	this.sprite = new Sprite("BlueSpikey.png");
	
	this.sprite.buildAnimation(12, 1, 64, 56, 0.05,
		[0, 1, 2, 3]);

	this.sprite.buildAnimation(12, 1, 64, 56, 0.05,
		[4, 5, 6, 7, 8, 9, 10, 11]);


	

	
	for(var i=0; i<ANIM_MAX; i++)
	{
		this.sprite.setAnimationOffset(i, -55, -87);
	}

	this.position = new Vector2(58, 58)

	this.velocity = new Vector2(0,0)
	
	this.width = 64;
	this.height = 56;
};

Enemy.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime);
	
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
	this.sprite.draw(context, this.position.x, this.position.y);
}