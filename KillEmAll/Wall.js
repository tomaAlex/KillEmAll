var firstTimer;
var betTimer;
var deltaTimer;

function timerStart()
{
  firstTimer = new Date().getTime();
}

function timerStop()
{
  secondTimer = new Date().getTime();
}

function coordonates()
{
  this.x;
  this.y;
}

function Wall()
{
  // solid object
  // the player cannot pass this layer
  // the gravity must be stoped when an object wall touches a player
  // after some time, the wall must disspear
  // this object is formed from a lot of circles on the screen
  this.numberOfDots = 0;
  this.coordonatesOfDots = [];
  this.circleRadius = 5;
  this.maximumDots = 100;
  this.create = function(x, y)
  {
    if(this.numberOfDots < this.maximumDots)
    {
      this.coordonatesOfDots[++this.numberOfDots] = new coordonates();
      this.coordonatesOfDots[this.numberOfDots].x = x;
      this.coordonatesOfDots[this.numberOfDots].y = y;
    }
  }
  this.update = function()
  {
    if(Keys.click == true)
    {
      this.create(mousseX, mousseY);
    }
  }
  this.show = function()
  {
    for(let i=1;i<=this.numberOfDots;i++)
    {
      fill(255,0,255);
      noStroke();
      circle(this.coordonatesOfDots[i].x,this.coordonatesOfDots[i].y, this.circleRadius);
    }
  }
}
