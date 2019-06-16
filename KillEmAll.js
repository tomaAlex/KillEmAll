var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;
var timeNow;
var timeThen;
var timerCanBeStarted = true;
var acceleration = false;
var counter = 0;
var accelerationMustBeUsed = 0;
var player;
var walls = [];
var wallNumber = 0;
var mousseX;
var mousseY;
var lastPointX;
var lastPointY;
var playerIsJumping = false;
var playerIsFalling = false;
var playerY_now;
var playerY_then;
var decrementationOfPlayerY = true;
var playerIsFallingCannotBecomeTrue = false;
var counterBullets = 0;
var bullets = [];

var Keys = {
  left: false,
  right: false,
  up: false,
  click: false
}

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  player = new Player();
  playerY_now = player.y;
  playerY_then = player.y;
}

function beginTimer()
{
  timeNow = new Date().getTime();
}

function stopTimer()
{
  timeThen = new Date().getTime();
  let deltaTime = timeThen - timeNow;
  //console.log(deltaTime);
  if(deltaTime<=100) {counter++;}
  else {counter = 0;}
  if(counter==2)
  {
    console.log("the acceleration is turned on!");
    acceleration = true;
    counter = 0;
  }
}

window.onkeydown = function(e)
{
  //console.log(e.keyCode);
  if(timerCanBeStarted) 
  {
    beginTimer();
    timerCanBeStarted = false;
  }
  let direction = e.keyCode;
  if(direction==39 || direction==68)
  {
    //console.log("right");
    Keys.right = true;
  }
  if(direction==37 || direction==65)
  {
    //console.log("left");
    Keys.left = true;
  }
  if(direction==32 || direction==38)
  {
    //console.log("up");
    Keys.up = true;
  }
}

window.onkeyup = function(e) {
  stopTimer();
  timerCanBeStarted = true;
  if(acceleration==true && accelerationMustBeUsed==1)
  {
    console.log("the acceleration has been stopped");
    acceleration = false;
    accelerationMustBeUsed = 0;
  }
  else if(acceleration==true)
  {
    accelerationMustBeUsed++;
  }
  let direction = e.keyCode;
  if(direction==39 || direction==68)
  {
    //console.log("right");
    Keys.right = false;
  }
  if(direction==37 || direction==65)
  {
    //console.log("left");
    Keys.left = false;
  }
  //if(direction==32 || direction==38)
  //{
  //  //console.log("up");
  //  Keys.up = false;
  //}
}

window.onmousedown = function(e)
{
  if(e.button == 0)
  {
    //console.log("left click");
    //console.log("mouse is being pressed");
    Keys.click = true;
    // one wall must be created
    walls[++wallNumber] = new Wall();
    walls[wallNumber].timerStart();
    
  }
  else if(e.button == 2)
  {
    //console.log("right click");
    bullets[++counterBullets] = new Bullet(player.x + player.r / 2, player.y, e.x, e.y);
  }
}

window.onmouseup = function()
{
  //console.log("mouse was released");
  Keys.click = false;
}

function distanceBetween(point1_x, point1_y, point2_x, point2_y, x0, y0) {
    return ((Math.abs((point2_y - point1_y) * x0 - (point2_x - point1_x) * y0 + point2_x * point1_y - point2_y * point1_x)) / (Math.pow((Math.pow(point2_y - point1_y, 2) + Math.pow(point2_x - point1_x, 2)), 0.5)));
}

window.onmousemove = function(e)
{
  //console.log(e.x + " " + e.y);
  mousseX = e.x;
  mousseY = e.y;
  // generate the points of the last wall
  if(Keys.click == true)
  {
    if(lastPointX)
    {
      if(dist(mousseX, mousseY, lastPointX, lastPointY)>=walls[wallNumber].circleRadius)
      {
        walls[wallNumber].create(mousseX, mousseY);
        lastPointX = mousseX;
        lastPointY = mousseY;
      }
    }
    else
    {
      walls[wallNumber].create(mousseX, mousseY);
      lastPointX = mousseX;
      lastPointY = mousseY;
    }
  }
}

function shouldTheGravityStop(x_less, y_less, x_more, y_more, xOfPlayer, yOfPlayer)
{
  // if a wall touches the coordinates the player, then the gravity must stop its effect on the player
  if(distanceBetween(x_less, y_less, x_more, y_more, xOfPlayer, yOfPlayer)<=5)
  {
    return true;
  }
  else
  {
    return false;
  }
}

function drawEveryWall()
{
  // draw every single wall
  for(let i=1;i<=wallNumber;i++)
  {
    walls[i].show();
    walls[i].timerStop();
    if(walls[i].checkForRemoval() == true)
    {
      // this wall must be deleted
      for(let j=i;j<wallNumber;j++)
      {
        walls[j] = walls[j+1];
      }
      walls.splice(wallNumber, 1);
      wallNumber--;
    }
  }
}

function checkTheWallsAbove()
{
  // check what walls are to be found above the coordinates of the player
  let whichWall;
  let pointNumber_1, pointNumber_2;
  let y_MAX = 0;
  let save_x_less, save_x_more;
  let save_y_less, save_y_more;
  for(let i=1;i<=wallNumber;i++)
  {
    let less = false;
    let more = false;
    let x_less, x_more;
    for(let j=1;j<=walls[i].numberOfDots;j++)
    {
      if(less==false || more==false)
      {
        if(walls[i].coordonatesOfDots[j].x <= player.x)
        {
          less = true;
          if(x_less)
          {
            if(walls[i].coordonatesOfDots[j].x > x_less)
            {
              x_less = walls[i].coordonatesOfDots[j].x;
              pointNumber_1 = j;
            }
          }
          else
          {
            x_less = walls[i].coordonatesOfDots[j].x;
            pointNumber_1 = j;
          }
        }
        else if(walls[i].coordonatesOfDots[j].x > player.x)
        {
          more = true;
          if(x_more)
          {
            if(walls[i].coordonatesOfDots[j].x < x_more)
            {
              x_more = walls[i].coordonatesOfDots[j].x;
              pointNumber_2 = j;
            }
          }
          else
          {
            x_more = walls[i].coordonatesOfDots[j].x;
            pointNumber_2 = j;
          }
        }
      }
    }
    if(less==true && more==true)
    {
      // check if this wall must be added on the list of walls to be checkd for any possible collision with the player
      if(walls[i].coordonatesOfDots[pointNumber_1].y > walls[i].coordonatesOfDots[pointNumber_2].y && walls[i].coordonatesOfDots[pointNumber_1].y > y_MAX)
      {
        y_MAX = walls[i].coordonatesOfDots[pointNumber_1].y;
        whichWall = i;
        
        save_x_less = walls[i].coordonatesOfDots[pointNumber_1].x;
        save_x_more = walls[i].coordonatesOfDots[pointNumber_2].x;
        
        save_y_less = walls[i].coordonatesOfDots[pointNumber_1].y;
        save_y_more = walls[i].coordonatesOfDots[pointNumber_2].y;
      }
      else if(walls[i].coordonatesOfDots[pointNumber_2].y > y_MAX)
      {
        y_MAX = walls[i].coordonatesOfDots[pointNumber_1].y;
        whichWall = i;
        
        save_x_less = walls[i].coordonatesOfDots[pointNumber_1].x;
        save_x_more = walls[i].coordonatesOfDots[pointNumber_2].x;
        
        save_y_less = walls[i].coordonatesOfDots[pointNumber_1].y;
        save_y_more = walls[i].coordonatesOfDots[pointNumber_2].y;
      }
    }
  }
  if(shouldTheGravityStop(save_x_less, save_y_less, save_x_more, save_y_more, player.x, player.y) == true)
  {
    player.delta = 51;
  }
}

function checkTheWallsBelow()
{
  // check what walls are to be found below the coordinates of the player
  let whichWall;
  let pointNumber_1, pointNumber_2;
  let y_MIN = canvasHeight;
  let save_x_less, save_x_more;
  let save_y_less, save_y_more;
  for(let i=1;i<=wallNumber;i++)
  {
    let less = false;
    let more = false;
    let x_less, x_more;
    for(let j=1;j<=walls[i].numberOfDots;j++)
    {
      if(less==false || more==false)
      {
        if(walls[i].coordonatesOfDots[j].x <= player.x)
        {
          less = true;
          if(x_less)
          {
            if(walls[i].coordonatesOfDots[j].x > x_less)
            {
              x_less = walls[i].coordonatesOfDots[j].x;
              pointNumber_1 = j;
            }
          }
          else
          {
            x_less = walls[i].coordonatesOfDots[j].x;
            pointNumber_1 = j;
          }
        }
        else if(walls[i].coordonatesOfDots[j].x > player.x)
        {
          more = true;
          if(x_more)
          {
            if(walls[i].coordonatesOfDots[j].x < x_more)
            {
              x_more = walls[i].coordonatesOfDots[j].x;
              pointNumber_2 = j;
            }
          }
          else
          {
            x_more = walls[i].coordonatesOfDots[j].x;
            pointNumber_2 = j;
          }
        }
      }
    }
    if(less==true && more==true)
    {
      // check if this wall must be added on the list of walls to be checkd for any possible collision with the player
      if(walls[i].coordonatesOfDots[pointNumber_1].y < walls[i].coordonatesOfDots[pointNumber_2].y && walls[i].coordonatesOfDots[pointNumber_1].y < y_MIN) // && walls[i].coordonatesOfDots[pointNumber_1].y >= player.y + player.r)
      {
        y_MIN = walls[i].coordonatesOfDots[pointNumber_1].y;
        whichWall = i;
        
        save_x_less = walls[i].coordonatesOfDots[pointNumber_1].x;
        save_x_more = walls[i].coordonatesOfDots[pointNumber_2].x;
        
        save_y_less = walls[i].coordonatesOfDots[pointNumber_1].y;
        save_y_more = walls[i].coordonatesOfDots[pointNumber_2].y;
      }
      else if(walls[i].coordonatesOfDots[pointNumber_2].y < y_MIN) // && walls[i].coordonatesOfDots[pointNumber_2].y >= player.y + player.r)
      {
        y_MIN = walls[i].coordonatesOfDots[pointNumber_1].y;
        whichWall = i;
        
        save_x_less = walls[i].coordonatesOfDots[pointNumber_1].x;
        save_x_more = walls[i].coordonatesOfDots[pointNumber_2].x;
        
        save_y_less = walls[i].coordonatesOfDots[pointNumber_1].y;
        save_y_more = walls[i].coordonatesOfDots[pointNumber_2].y;
      }
    }
  }
  if(save_x_less, save_y_less, save_x_more, save_y_more)
  {
    // a wall exist below the coordinates of the player
    if(shouldTheGravityStop(save_x_less, save_y_less, save_x_more, save_y_more, player.x, player.y + player.r) == true)
    {
      player.whereGravityStops = player.y + 15;
      decrementationOfPlayerY = true;
    }
    else
    {
      player.whereGravityStops = canvasHeight;
    }
  }
}

function checkBulletCollision()
{
  // collision with walls

  // the coordinates of the point where the bullet must disappear could be predetermined
  // knwoing the movement ecuation of the bullet and calculating all ecautions determined by every two consecutive points of any wall, the coordinates of the point of interesction can be calcualted
  // even if the there is a point of interesction between those two lines (the movement ecuation and the ecuation made by two consecutive points of a wall), it doesn't necessarily mean the bullet shoudl disappear there
  // the bullet should disappear at the point of interestction, only if the x value of the point is to be found between the x values of those two consecutive points of the wall

  for(let cc=1;cc<=counterBullets;cc++)
  {
    for(let i=1;i<=wallNumber;i++)
    {
      for(let j=1;j<walls[i].numberOfDots;j++)
      {
        // determine whether, between j and j+1, exists a point, where the bullet cc should disappear, or not
        let m_wall = (walls[i].coordonatesOfDots[j+1].y - walls[i].coordonatesOfDots[j].y) / (walls[i].coordonatesOfDots[j+1].x - walls[i].coordonatesOfDots[j].x);
        let xx = (m_wall * walls[i].coordonatesOfDots[j].x - bullets[cc].m * bullets[cc].x1 + bullets[cc].y1 - walls[i].coordonatesOfDots[j].y) / (m_wall - bullets[cc].m);
        if(xx >= walls[i].coordonatesOfDots[j].x && xx <= walls[i].coordonatesOfDots[j+1].x)
        {
          let yy = bullets[cc].m * xx - bullets[cc].m * bullets[cc].x1 + bullets[cc].y1;
          // checking whether or not this is a real point of collision
          // if the bullet is going up, but the coordinates of collision point is below the bullet, that's not a real collision point
          // if the bullet is going down, but the coordinates of collision point is above the bullet, that's not a real collision point
          if((bullets[cc].goUp == true && yy <= bullets[cc].y) || (bullets[cc].goDown == true && yy >= bullets[cc].y))
          {
            // well, this is worth checking further: is this point at a smaller distance than before?
            if(bullets[cc].xToDisappear && distanceBetween(walls[i].coordonatesOfDots[j].x, walls[i].coordonatesOfDots[j].y, walls[i].coordonatesOfDots[j+1].x, walls[i].coordonatesOfDots[j+1].y, bullets[cc].x, bullets[cc].y) <= bullets[cc].distanceBetween)
            {
              // this point is at a smaller distance than the point before, so this is the point where cc must stop
              bullets[cc].xToDisappear = xx;
              bullets[cc].yToDisappear = bullets[cc].m * xx - bullets[cc].m * bullets[cc].x1 + bullets[cc].y1;
              bullets[cc].whichWallTouches = i;
              bullets[cc].pointWall_1 = j;
              bullets[cc].pointWall_2 = j+1;
              bullets[cc].distanceBetween = distanceBetween(walls[i].coordonatesOfDots[j].x, walls[i].coordonatesOfDots[j].y, walls[i].coordonatesOfDots[j+1].x, walls[i].coordonatesOfDots[j+1].y, bullets[cc].x, bullets[cc].y);
              console.log("the bullet " + cc + " is going to collide with the wall " + i);
              j = walls[i].numberOfDots + 10;
              //i = wallNumber;
            }
            else if(!bullets[cc].xToDisappear)
            {
              // this is the point where cc must stop
              bullets[cc].xToDisappear = xx;
              bullets[cc].yToDisappear = bullets[cc].m * xx - bullets[cc].m * bullets[cc].x1 + bullets[cc].y1;
              bullets[cc].whichWallTouches = i;
              bullets[cc].pointWall_1 = j;
              bullets[cc].pointWall_2 = j+1;
              bullets[cc].distanceBetween = distanceBetween(walls[i].coordonatesOfDots[j].x, walls[i].coordonatesOfDots[j].y, walls[i].coordonatesOfDots[j+1].x, walls[i].coordonatesOfDots[j+1].y, bullets[cc].x, bullets[cc].y);
              console.log("the bullet " + cc + " is going to collide with the wall " + i);
              j = walls[i].numberOfDots + 10;
              //i = wallNumber;
            }
          }
        }
      }
    }
  }
  // collision with players
}

function draw() {
  //frameRate(100);
  background(100);
  player.update();
  
  // is the player jumping or falling?
  playerY_now = player.y;
  if(playerY_now - playerY_then > 0)
  {
    playerIsJumping = false;
    playerIsFalling = true;
    playerY_then = playerY_now;
  }
  else if(playerY_now - playerY_then < 0)
  {
    playerIsJumping = true;
    playerIsFalling = false;
    playerY_then = playerY_now;
  }
  else if(playerY_now == playerY_then)
  {
    playerIsJumping = false;
    playerIsFalling = false;
  }
  
  stroke(255,255,255);
  player.show();
  drawEveryWall();
  if(playerIsJumping == true)
  {
    checkTheWallsAbove();
  }
  checkTheWallsBelow();

  // check where bullets should eventually disappear
  checkBulletCollision();

  // draw the bullets, which still exist
  for(let i=1;i<=counterBullets;i++)
  {
    if(bullets[i].collisionDeletion == true)
    {
      // check whtether the wall of collision stil exists
      if(typeof walls[bullets[i].whichWallTouches] == "undefined" && typeof walls[bullets[i].whichWallTouches] == "undefined")
      {
        console.log("wall of collision doesn't exist anymore");
        // the wall doesn't exist anymore, so the bullet is not disappearing right now
        bullets[i].collisionDeletion = false;
        bullets[i].mustBeDeleted = false;
        bullets[i].xToDisappear = null;
        bullets[i].yToDisappear = null;
        bullets[i].distanceBetween = canvasWidth + 900;
      }
    }
    if(bullets[i].mustBeDeleted == true)
    {
      // this bullet must dissappear
      bullets.splice(i, 1);
      counterBullets--;
    }
    else
    {
      fill(0,255,0);
      stroke(0,255,0);
      bullets[i].update();
      bullets[i].show();
    }
  }
}
