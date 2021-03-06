
function random(min, max)
{
	var num = Math.random();
	return min + (max - min) * num;
}

var Particle = function() 
{
	this.position = new Vector2();
    this.size = new Vector2();
	
	this.velocity = new Vector2();
	this.acceleration = new Vector2();

	this.rotation = 0;
	this.life = 0;

	this.alpha = 0;
}


var Emitter = function(imageFilename, positionX, positionY) 
{
	this.particles = [];
	this.elapsedEmittionTime = 0;

	this.texture = document.createElement("img");
	this.texture.src = imageFilename;
	
	this.position = new Vector2();
	this.position.Set(positionX, positionY);
	
	this.emissionSize = new Vector2();
	this.emissionSize.Set(5, 5);
	this.emissionRate = 1000;

	this.minLife = 0.5;
	this.maxLife = 3;
	this.minSize = 8;
	this.maxSize = 32;
	this.minVelocity = new Vector2();
	this.minVelocity.Set(-50, -50);
	this.maxVelocity = new Vector2();
	this.maxVelocity.Set(50, 50);
	this.gravity = 0;
	this.wind = 0;
	this.transparency = 0.25;
}

Emitter.prototype.update = function(dt) 
{	
	this.elapsedEmittionTime += dt;

	while( this.elapsedEmittionTime > (1.0 / this.emissionRate))
	{
		this.spawnParticle();
		this.elapsedEmittionTime -= (1.0 / this.emissionRate);
	}

	for (var i = this.particles.length - 1; i >= 0; i--)
	{
		var p = this.particles[i];

		p.life -= dt;
		if (p.life <= 0.0) 
			this.particles.splice(i, 1);

		p.acceleration.y += this.gravity * dt;
		p.acceleration.x += this.wind * dt;

		p.velocity.Set( p.velocity.x + p.acceleration.x * dt, p.velocity.y + p.acceleration.y );
		p.position.x += p.velocity.x * dt;
		p.position.y -= p.velocity.y * dt;

		if (p.life <= 1.0)
			p.alpha = p.life * this.transparency;
	}
}

Emitter.prototype.draw = function() 
{	
	var origin = new Vector2();
	origin.Set(this.texture.width / 2, this.texture.height / 2);

	for(var i=0; i<this.particles.length; i++ )
	{
		var p = this.particles[i];
		
		var scale = new Vector2();
		scale.Set( p.size.x / this.texture.width, p.size.y / this.texture.height);
	
		context.save();
		context.translate(p.position.x, p.position.y);
		context.rotate(p.rotation);
		context.globalAlpha = p.alpha;
		context.drawImage(this.texture, origin.x * scale.x, origin.y * scale.y, p.size.x, p.size.y);
		context.restore();		
	}
}

Emitter.prototype.spawnParticle = function()
{
	var p = new Particle();

	p.life = random(this.minLife, this.maxLife);
	p.rotation = 0;	
	p.acceleration.Set(this.wind, -this.gravity);
	p.velocity.Set(
		random(this.minVelocity.x, this.maxVelocity.x), 
		random(this.minVelocity.y, this.maxVelocity.y) );
		
	p.position.Set(
		random(-this.emissionSize.x/2, this.emissionSize.x/2) + this.position.x, 
		random(-this.emissionSize.y/2, -this.emissionSize.y/2) + this.position.y );
		
	p.size.Set(	random(this.minSize, this.maxSize),	random(this.minSize, this.maxSize) );
		
	p.alpha = this.transparency;

	this.particles.push(p);
}

		
function createBurstEmitter(particleTexture, posX, posY)
{
	var emitter = new Emitter(particleTexture, posX, posY);
	return emitter;
}

function createFireEmitter(particleTexture, posX, posY)
{
	var e = new Emitter(particleTexture, posX, posY);
	e.gravity = 0.0;

	e.minLife = 0.25;
	e.maxLife = 2.0;

	e.minVelocity.Set(0.0, 0.0);
	e.maxVelocity.Set(0.0, 100.0);

	e.emissionRate = 1000.0;

	e.emissionSize.Set(10.0, 1.0);
	e.transparency = 0.15;

	return e;
}


function createBloodEmitter(particleTexture, posX, posY)
{
	var e = new Emitter(particleTexture, posX, posY);
	e.gravity = 1;

	e.minLife = 1.0;
	e.maxLife = 3.0;
	e.minSize = 8;
	e.maxSize = 16;

	e.minVelocity.Set(0.0, 1.0);
	e.maxVelocity.Set(0.0, 1.0);

	e.emissionRate = 50.0;

	e.emissionSize.Set(10.0, 1.0);
	e.transparency = 0.75;

	return e;
}

function createFlyingStarsEmitter(particleTexture, posX, posY)
{
	var e = new Emitter(particleTexture, posX, posY);
	e.emissionSize.Set(SCREEN_WIDTH/2, 0);
	e.emissionRate = 100.0;
	e.minLife = 2.0;
	e.maxLife = 7.0;
	e.transparency = 0.20;
	e.minVelocity.x = 0.0;
	e.maxVelocity.x = 0.0;
	e.minVelocity.y = 75.0;
	e.maxVelocity.y = 100.0;
	e.transparency = 0.5;
	return e;
}

function createBoneShardEmitter(particleTexture, posX, posY)
{
	var e = new Emitter(particleTexture, posX, posY);
	e.gravity = 0;

	e.minLife = 1.0;
	e.maxLife = 3.0;
	e.minSize = 1;
	e.maxSize = 10;

	e.minVelocity.Set(0.0, 11.0);
	e.maxVelocity.Set(0.0, -11.0);

	e.emissionRate = 30.0;

	e.emissionSize.Set(10.0, 1.0);
	e.transparency = 0.65;

	return e;
}