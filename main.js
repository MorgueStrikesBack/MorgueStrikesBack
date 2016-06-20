var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();


function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}


var fps = 0;
var fpsCount = 0;
var fpsTime = 0;
var DEBUG = 1;	

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

var LAYER_COUNT = 6;
var LAYER_BACKGROUND = 0;
var LAYER_PLATFORMS = 1;
var LAYER_ELEVATOR = 2;
var LAYER_ENEMIES = 3;
var LAYER_GOLD = 4;
var LAYER_BED= 5;

var MAP = {tw:50, th:32};
var TILE = 35;
var TILESET_TILE= TILE;
var TILESET_PADDING = 0;
var TILESET_SPACING = 0;
var TILESET_COUNT_X = 27;
var TILESET_COUNT_Y = 1;

var METER = TILE;
var GRAVITY = METER * 9.8 * 6;
var MAXDX = METER * 5;
var MAXDY = METER * 15;
var ACCEL = MAXDX * 2;
var FRICTION = MAXDX * 6;
var JUMP = METER * 1500;

var player = new Player();
var keyboard = new Keyboard();


var bullets = [];

var stateManager = new StateManager();

stateManager.pushState( new SplashState() );

var tileset = document.createElement("img");
tileset.src = "hospital tileset.png";


function intersects(x1, y1, w1, h1, x2, y2, w2, h2)
{
	if(y2 + h2 < y1 ||
	x2 + w2 < x1 ||
	x2> x1 + w1 ||
	y2 > y1 + h1)
	{
		return false;
	}
	return true;
}

function cellAtPixelCoord(layer, x,y)
{
    if(x<0 || x>SCREEN_WIDTH || y<0)
     return 1;
    if(y>SCREEN_HEIGHT)
     return 0;
    return cellAtTileCoord(layer, p2t(x), p2t(y));
};

function cellAtTileCoord(layer, tx, ty)
{
    if(tx<0 || tx>=MAP.tw || ty<0)
      return 1;
    if(ty>=MAP.th)
      return 0;
    return cells[layer][ty][tx];
};

function tileToPixel(tile)
{
    return tile * TILE;
};

function pixelToTile(pixel)
{
    return Math.floor(pixel/TILE);
};

function bound(value, min, max)
{
    if(value < min)
      return min;
    if(value > max)
      return max;
    return value;
}   

var worldOffsetX = 0;
currentLevel = level1

function drawMap() {
   
    var maxTiles = Math.floor(SCREEN_WIDTH / TILE) + 2;
    var tileX = pixelToTile(player.position.x);
    var offsetX = TILE + Math.floor(player.position.x % TILE);
    startX = tileX - Math.floor(maxTiles / 2);
    if (startX < -1) {
        startX = 0;
        offsetX = 0;
    }
    if (startX > MAP.tw - maxTiles) {
        startX = MAP.tw - maxTiles + 1;
        offsetX = TILE;
    }

    worldOffsetX = startX * TILE + offsetX;
    for (var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++) {
        for (var y = 0; y < currentLevel.layers[layerIdx].height; y++) {
            var idx = y * currentLevel.layers[layerIdx].width + startX;
            for (var x = startX; x < startX + maxTiles; x++) {
                if (currentLevel.layers[layerIdx].data[idx] != 0) {
                    var tileIndex = currentLevel.layers[layerIdx].data[idx] - 1;
                    var sx = TILESET_PADDING + (tileIndex % TILESET_COUNT_X) *
                        (TILESET_TILE + TILESET_SPACING);
                    var sy = TILESET_PADDING + (Math.floor(tileIndex / TILESET_COUNT_Y)) *
                        (TILESET_TILE + TILESET_SPACING);
                    context.drawImage(tileset, sx, sy, TILESET_TILE, TILESET_TILE,
                        (x - startX) * TILE - offsetX, (y - 1) * TILE, TILESET_TILE, TILESET_TILE);
                }
                idx++;
            }
        }
    }
}

//var musicBackground;
var sfxJump;

var cells = [];
function initialize() {
    for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++) {
        cells[layerIdx] = [];
        var idx = 0;
        for(var y = 0; y < currentLevel.layers[layerIdx].height; y++) {
            cells[layerIdx][y] = [];
            for(var x = 0; x < currentLevel.layers[layerIdx].width; x++) {
                if(currentLevel.layers[layerIdx].data[idx] !=0) {
                    cells[layerIdx][y][x] = 1;
                    cells[layerIdx][y-1][x] = 1;
                    cells[layerIdx][y-1][x+1] = 1;
                    cells[layerIdx][y][x-1] = 1;
                }
                else if(cells[layerIdx][y][x] !=1) {
                    cells[layerIdx][y][x] = 0;
                }
                idx++;
            }
        }
    }
}   
    
function initializeMusic()
{    
    /*musicBackground = new Howl(
        {
            urls: ["background.ogg"],
            loop: true,
            buffer: true,
            volume: 0.1
        });
        
   musicBackground.play();*/

	sfxBegin = new Howl(
	{
		urls: ["begin.ogg"],
		buffer: true,
		volume: 0.7,
		onend: function()
		{
			isSfxPlaying = false;
		}

	} );   
	
	sfxJump = new Howl(
	{
		urls: ["jumpEffect.ogg"],
		buffer: true,
		volume: 0.2,
		onend: function()
		{
			isSfxPlaying = false;
		}

	} );
}


initializeMusic();
initialize();

function run()
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
    
	stateManager.update(deltaTime);
	stateManager.draw();	

    player.update(deltaTime);
    drawMap();
    player.draw();

    for(var i=0; i<bullets.length; i++)
	{
		bullets[i].update(deltaTime);

	}

	for(var i=0; i<bullets.length; i++)
	{
		bullets[i].draw();
	}

	if(player.cooldownTimer >= 0)	
		player.cooldownTimer -= deltaTime

	if(DEBUG == 1)
	{

	
		fpsTime += deltaTime;
		fpsCount++;
		if(fpsTime >= 1)
		{
			fpsTime -= 1;
			fps = fpsCount;
			fpsCount = 0;
		}		
			
	
		context.fillStyle = "#f00";
		context.font="14px Arial";
		context.fillText("FPS: " + fps, 5, 20, 100);
	}	    
    drawMap(deltaTime);
    
}




(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
