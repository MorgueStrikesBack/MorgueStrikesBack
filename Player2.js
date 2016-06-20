var PLAYER_SPEED = 300;

var LEFT = 0
var RIGHT = 1;

var ANIM_IDLE_LEFT = 0;
var ANIM_JUMP_LEFT = 1;
var ANIM_WALK_LEFT = 2;
var ANIM_SHOOT_LEFT = 3;
var ANIM_MELEE_LEFT = 4;
var ANIM_IDLE_RIGHT = 5;
var ANIM_JUMP_RIGHT = 6;
var ANIM_WALK_RIGHT = 7;
var ANIM_SHOOT_RIGHT = 8;
var ANIM_MELEE_RIGHT = 9;
var ANIM_MAX = 10;

var Player = function() {
    this.sprite = new Sprite("player.png");
    this.sprite.buildAnimation(23, 1, 40, 49, 0.5, [0, 1, 2, 3,]);
    this.sprite.buildAnimation(23, 1, 40, 49, 0.5, []);
    this.sprite.buildAnimation(23, 1, 40, 49, 0.5, [4,5,6,7,]);
    this.sprite.buildAnimation(23, 1, 40, 49, 0.5, [20,21,22]);
    this.sprite.buildAnimation(23, 1, 40, 49, 0.5, [12,13,14,15,16,17,18,19]);
    this.sprite.buildAnimation(23, 1, 40, 49, 0.5, []);
    this.sprite.buildAnimation(23, 1, 40, 49, 0.5, []);
    this.sprite.buildAnimation(23, 1, 40, 49, 0.5, [8,9,10,11]);
    this.sprite.buildAnimation(23, 1, 40, 49, 0.5, []);
    this.sprite.buildAnimation(23, 1, 40, 49, 0.5, []);
    

    for (var i = 0; i < ANIM_MAX; i++) {
        this.sprite.setAnimationOffset(i, -55, -87);
    }

    this.position = new Vector2();
    this.position.set = (9 * TILE, 0 * TILE);

    this.width = 15;
    this.height = 40;

    this.velocity = new Vector2();

    this.falling = true;
    this.jumping = false;

    this.direction = LEFT;
    
    this.cooldownTimer = 0;

};

Player.prototype.update = function(deltaTime) {
    this.sprite.update(deltaTime);

    var left = false;
    var right = false;
    var jump = false;

    if (keyboard.isKeyDown(keyboard.KEY_LEFT) == true) {
        left = true;
        this.direction = LEFT;
        if (this.sprite.currentAnimation != ANIM_WALK_LEFT && this.jumping == false) {
            this.sprite.setAnimation(ANIM_WALK_LEFT);
        }

    }
    else if (keyboard.isKeyDown(keyboard.KEY_RIGHT) == true) {
        right = true;
        this.direction = RIGHT;
        if (this.sprite.currentAnimation != ANIM_WALK_RIGHT && this.jumping == false) {
            this.sprite.setAnimation(ANIM_WALK_RIGHT);
        }
    }
    else {
        if (this.jumping == false && this.falling == false) {
            if (this.direction == LEFT) {
                if (this.sprite.currentAnimation != ANIM_IDLE_LEFT)
                    this.sprite.setAnimation(ANIM_IDLE_LEFT);
            }
            else {
                if (this.sprite.currentAnimation != ANIM_IDLE_RIGHT) {
                    this.sprite.setAnimation(ANIM_IDLE_RIGHT);
                }

            } 
        }
    }
    if (keyboard.isKeyDown(keyboard.KEY_UP) == true) {
        jump = true;
        if (left == true) {
            this.sprite.setAnimation(ANIM_JUMP_LEFT);
        }
        if (right == true) {
            this.sprite.setAnimation(ANIM_JUMP_RIGHT);
        }
        
    }

    var wasleft = this.velocity.x < 0;
    var wasright = this.velocity.x > 0;
    var falling = this.falling;
    var ddx = 1;
    var ddy = GRAVITY;

    if (left)
        ddx = ddx - ACCEL;
    else if (wasleft)
        ddx = ddx + FRICTION; 

    if (right)
        ddx = ddx + ACCEL;
    else if (wasright)
        ddx = ddx - FRICTION;

    if (jump && !this.jumping && !falling) {
        ddy = ddy - JUMP;
        this.jumping = true;
        if (this.direction == LEFT) {
            this.sprite.setAnimation(ANIM_JUMP_LEFT)
        }
        else {
            this.sprite.setAnimation(ANIM_JUMP_RIGHT)
        }

    }

    this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
    this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));

    this.velocity.x = bound(this.velocity.x + (deltaTime * ddx), -MAXDX, MAXDX);
    this.velocity.y = bound(this.velocity.y + (deltaTime * ddy), -MAXDY, MAXDY);

    if ((wasleft && (this.velocity.x > 0)) ||
        (wasright && (this.velocity.x < 0))) {
        this.velocity.x = 0;
    }

    var tx = pixelToTile(this.position.x);
    var ty = pixelToTile(this.position.y);

    var nx = (this.position.x) % TILE;
    var ny = (this.position.y) % TILE;

    var cell = cellAtTileCoord(LAYER_PLATFORMS, tx, ty);
    var cellright = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty);
    var celldown = cellAtTileCoord(LAYER_PLATFORMS, tx, ty + 1);
    var celldiag = cellAtTileCoord(LAYER_PLATFORMS, tx + 1, ty + 1);

    if (this.velocity.y > 0) {
        if ((celldown && !cell) || (celldiag && !cellright & nx)) {
            this.position.y = tileToPixel(ty);
            this.velocity.y = 0;
            this.falling = false;
            this.jumping = false;
            ny = 0;
        }
    }
    else if (this.velocity.y < 0) {
        if ((cell && !celldown) || (cellright && !celldiag && nx)) {
            this.position.y = tileToPixel(ty + 1);
            this.velocity.y = 0;
            cell = celldown;
            cellright = celldiag;
            ny = 0;
        }
    }
    if (this.velocity.x > 0) {
        if ((cell && !cellright) || (celldiag && !celldown & ny)) {
            this.position.x = tileToPixel(tx);
            this.velocity.x = 0;
        }
    }
    else if (this.velocity.x < 0) {
        if ((cell && !cellright) || (celldown && !celldiag && ny)) {
            this.position.x = tileToPixel(tx + 1);
            this.velocity.x = 0;
        }

    }
}

Player.prototype.draw = function() {
    this.sprite.draw(context, this.position.x, this.position.y);
} 