
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
  this.circleRadius = 2;
  this.maximumDots = 13;
  this.firstTimer;
  this.secondTimer;
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
  this.timerStart = function()
  {
    this.firstTimer = new Date().getTime();
  }
  this.timerStop = function()
  {
    this.secondTimer = new Date().getTime();
  }
  this.checkForRemoval = function()
  {
    if(this.firstTimer && this.secondTimer)
    {
      //they both exist
      if(this.secondTimer - this.firstTimer >= 5000)
      {
        return true;
      }
      else
      {
        return false;
      }
    }
  }
  this.show = function()
  {
    for(let i=1;i<this.numberOfDots;i++)
    {
      stroke(255,0,255);
      line(this.coordonatesOfDots[i].x,this.coordonatesOfDots[i].y, this.coordonatesOfDots[i+1].x, this.coordonatesOfDots[i+1].y); 
    }
  }
}
