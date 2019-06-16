function Bullet(x, y, directionX, directionY)
{
    this.x = x; // where the player is on the Ox
    this.y = y; // where the player is on the Oy
    this.directionX = directionX; // where the mouse cursor is on Ox
    this.directionY = directionY; // where the mouse cursor is on Oy
    this.Width = 5;
    this.Height = 5;
    this.mustBeDeleted = false;
    this.xToDisappear; // initially, it is null (maybe, there are not walls)
    this.yToDisappear; // initially, it is null (maybe, there are not walls)
    this.whichWallTouches; // the eventual wall the bullet is going to collide
    this.pointWall_1; // first point of the interval of the wall
    this.pointWall_2; // second point of the interval of the wall
    this.collisionDeletion = false; // this is true, only if the bullet is deleted because of a collision with a wall
    this.distanceBetween = canvasWidth + 900; // distance between the wall of collision and the bullet
    // the ecuation of movement must be determined
	// m = (y2 - y1) / (x2 - x1)
    // y = mx - mx1 + y1
    this.x1 = this.directionX; // used for the ecuation
    this.y1 = this.directionY; // used for the ecuation
    this.m = (this.y - this.directionY) / (this.x - this.directionX); // also, used for ecuation
    // x1 = this.directionX

    this.goDown = false;
    this.goUp = false;
    this.goLeft = false;
    this.goRight = false;

    if(this.directionY <= this.y) this.goUp = true;
    if(this.directionY > this.y) this.goDown = true;
    if(this.directionX <= this.x) this.goLeft = true;
    if(this.directionX > this.x) this.goRight = true;
    
    this.deltaDistance = 10;

    this.update = function()
    {
    	// update the coordiantes, using the movement ecuation

        if(this.goUp == true && this.goRight == true) this.x += Math.cos(Math.atan(this.m)) * this.deltaDistance;
        else if(this.goUp == true && this.goLeft == true) this.x -= Math.cos(Math.atan(this.m)) * this.deltaDistance;
        else if(this.goDown == true && this.goRight == true) this.x += Math.cos(Math.atan(this.m)) * this.deltaDistance;
        else if(this.goDown == true && this.goLeft == true) this.x -= Math.cos(Math.atan(this.m)) * this.deltaDistance;
        this.y = this.m * this.x - this.m * this.directionX + this.directionY;
        if(this.x > canvasWidth || this.x < 0) this.mustBeDeleted = true;
        if(this.y > canvasHeight || this.y < 0) this.mustBeDeleted = true;
        if(this.xToDisappear)
        {
            // the point is going to collide
            if(this.goRight == true)
            {
                if(this.goUp == true)
                {
                    if(this.x >= this.xToDisappear && this.y <= this.yToDisappear)
                    {
                        this.mustBeDeleted = true;
                        this.collisionDeletion = true;
                    }
                }
                else if(this.goDown == true)
                {
                    if(this.x >= this.xToDisappear && this.y >= this.yToDisappear)
                    {
                        this.mustBeDeleted = true;
                        this.collisionDeletion = true;
                    }
                }
            }
            else if(this.goLeft == true)
            {
                if(this.goUp == true)
                {
                    if(this.x <= this.xToDisappear && this.y <= this.yToDisappear)
                    {
                        this.mustBeDeleted = true;
                        this.collisionDeletion = true;
                    }
                }
                else if(this.goDown == true)
                {
                    if(this.x <= this.xToDisappear && this.y >= this.yToDisappear)
                    {
                        this.mustBeDeleted = true;
                        this.collisionDeletion = true;
                    }
                }
            }
        }

    }
    this.show = function()
    {
        fill(0,255,0);
        stroke(0,255,0);
    	console.log("show function works");
    	ellipse(this.x, this.y, this.Width, this.Height);
    }
}