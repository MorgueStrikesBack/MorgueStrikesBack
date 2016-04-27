var Vector2 = function (nX,nY)
{
	this.x = nX
	this.y = nY
}

Vector2.prototype.Set = function (nX,nY)
{
		this.x = nX
		this.y = nY	
}

Vector2.prototype.Magnitude = function ()
{
	var mag = this.x * this.x + this.y * this.y;
	mag = Math.sqrt(mag);
	return mag;
}

Vector2.prototype.Normalize = function ()
{
	var mag = this.Magnitude();
	this.x /= mag;
	this.y /= mag;
}

Vector2.prototype.GetNormal = function ()
{
	var mag = this.Magnitude();
	var v2 = new Vector2(0,0);

	v2.x = this.x / mag;
	v2.y = this.y / mag;

	return v2;
}

Vector2.prototype.Add = function (other)
{
	this.x += other.x;
	this.y += other.y;
}

Vector2.prototype.Subtract = function (other)
{
	this.x -= other.x;
	this.y -= other.y;
}

Vector2.prototype.Multiply = function (scaler)
{
	this.x *= scaler.x;
	this.y *= scaler.y;
}

Vector2.prototype.Divide = function (scaler)
{
	this.x /= scaler.x;
	this.y /= scaler.y;
}