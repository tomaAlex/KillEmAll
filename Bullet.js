function Bullet(x, y, directionX, directionY)
{
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.Width = 5;
    this.Height = 5;
    // the ecuation of movement must be determined
	// m = (y2 - y1) / (x2 - x1)
	// y = mx - mx1 + y1
    this.m = (this.y - this.directionY) / (this.x - this.directionX);
    // x1 = this.directionX
    // y1 = this.directionY
    //this.m *= -1;

    this.goDown = false;
    this.goUp = false;
    this.exceptedCase = false;

    if(this.directionY > this.y) this.goUp = true;
    else if(this.directionY < this.y) this.goDown = true;
    else this.exceptedCase = true; 

    this.deltaDistance = 10;

    this.update = function()
    {
    	// update the coordiantes, using the movement ecuation

    	if(this.goUp == true) this.x += Math.cos(Math.atan(this.m)) * this.deltaDistance;
    	else if(this.goDown == true) this.x += Math.cos(Math.atan(this.m)) * this.deltaDistance;
    	else if(this.exceptedCase == true) this.y -= this.deltaDistance;

    	if(this.exceptedCase == false) this.y = this.m * this.x - this.m * this.directionX + this.directionY;

    }
    this.show = function()
    {
    	fill(0,255,0);
    	console.log("show function works");
    	ellipse(this.x, this.y, this.Width, this.Height);
    }
}