function dotZero(whatWall, pointY)
{
  this.whatWall;
}

function Player()
{
  this.r = 15;
  this.x = Math.random() * canvasWidth;
  this.y = Math.random() * canvasHeight;
  this.movementIncrement = 5;
  this.acceleration = 0.5;
  this.velocity = 0;
  this.bottom = canvasHeight - this.r;
  this.delta = 0;
  
  this.jump = function()
  {
    if(this.delta <= 50)
    {
      this.y -= this.movementIncrement * 2.5;
      this.delta++;
      //console.log("still in while...");
      console.log(this.delta);  
    }
    if(this.delta >= 50)
    {
      this.delta = 0;
      Keys.up = false;
      jumping = false;
    }
    if(this.y + this.r > canvasHeight)
    {
      this.y = this.bottom;
      Keys.up = false;
    }
  }
  this.update = function()
  {
    if(Keys.right==true)
    {
      if(acceleration==false)
      {
        if(this.x + this.r < canvasWidth)
        {
          this.x += this.movementIncrement;
        }
        else
        {
          Keys.right = false;
        }
      }
      else if(acceleration==true)
      {
        if(this.x + this.r < canvasWidth)
        {
          this.x += this.movementIncrement * 2;
        }
        else
        {
          Keys.right = false;
        }
      }
    }
    if(Keys.left==true)
    {
      if(acceleration==false)
      {
        if(this.x > 0)
        {
          this.x -= this.movementIncrement;
        }
        else
        {
          Keys.left = false;
        }
      }
      else if(acceleration==true)
      {
        if(this.x > 0)
        {
          this.x -= this.movementIncrement * 2;
        }
        else
        {
          Keys.left = false;
        }
      }
    }
    if(Keys.up==true)
    {
      this.jump();
    }
    // gravity
    //this.MIN_Y = 999999999; // check what is the smallest y of the points of every wall
    //for(let i=1;i<=wallNumber;i++)
    //{
    //  for(let j=1;j<=walls[i].numberOfDots;j++)
    //  {
    //    if(walls[i].coordonatesOfDots[j].y < MIN_Y && this.x)
    //    {
    //      MIN_Y = walls[i].coordonatesOfDots[j].y;
    //    }
    //  }
    //}
    //if(this.MIN_Y == 999999999)
    //{
    //  this.MIN_Y = canvasHeight;
    //}
    if(this.y + this.r < canvasHeight)
    {
      this.velocity += this.acceleration;
      this.y += this.velocity;
      if(this.y + this.r > canvasHeight)
      {
        this.y = canvasHeight - this.r;
      }
    }
    else
    {
      this.velocity = 0;
    }
    // check where coordonates are
    if(this.x < 0)
    {
      console.log("x is smaller than 0");
      this.x = 0;
    }
    if(this.x + this.r > canvasWidth)
    {
      console.log("x is bigger than the width of the height");
      this.x = canvasWidth - this.r;
    }
    // check whether the player touches any walls or not
    // if so, then delta becomes bigger than 50, thus the gravity stops
    let MIN = 999999999;
    for(let i=1;i<=wallNumber;i++)
    {
      for(let j=1;j<=walls[i].numberOfDots;j++)
      {
        if(this.y + this.r <= walls[i].coordonatesOfDots[j].y && walls[i].coordonatesOfDots[j].y < MIN)
        {
          MIN = walls[i].coordonatesOfDots[j].y;
        }
      }   
    }
    // all of the coordonates of the walls have been checked
    // see where the player should eventually stop
    for(let i=1;i<=wallNumber;i++)
    {
      for(let j=1;j<=walls[i].numberOfDots;j++)
      {
        if(this.y + this.r <= walls[i].coordonatesOfDots[j].y && walls[i].coordonatesOfDots[j].y == MIN)
        {
          // this is the point where the delta must become 0
        }
      }   
    }
  }
  this.show = function()
  {
    fill(255);
    rect(this.x, this.y, this.r, this.r);
  }
}
