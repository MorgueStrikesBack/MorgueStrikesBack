

var Trigger = function(x, y)
 {



	this.position = new Vector2()
	this.position.Set(x, y)


	
	this.width = 70;
	this.height = 70;


};

Trigger.prototype.draw = function()
{


	context.fillStyle = "blue"
	context.fillRect(this.position.x, this.position.y, 70, 70)
}
