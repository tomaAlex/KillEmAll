function Bullet(x, y, directionX, directionY)
{
    this.x = x; // where the player is on the Ox
    this.y = y; // where the player is on the Oy
    this.directionX = directionX; // where the mouse cursor is on Ox
    this.directionY = directionY; // where the mouse cursor is on Oy
    this.Width = 5;
    this.Height = 5;
    this.mustBeDeleted = false;
    // the ecuation of movement must be determined
	// m = (y2 - y1) / (x2 - x1)
	// y = mx - mx1 + y1
    this.m = (this.y - this.directionY) / (this.x - this.directionX);
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

    }
    this.show = function()
    {
    	fill(0,255,0);
    	console.log("show function works");
    	ellipse(this.x, this.y, this.Width, this.Height);
    }
}