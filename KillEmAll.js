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

window.onmousedown = function()
{
  //console.log("mouse is being pressed");
  Keys.click = true;
  // one wall must be created
  walls[++wallNumber] = new Wall();
  walls[wallNumber].timerStart();
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

window.oncontextmenu = function (e)
{
    //alert("right click was pressed");
    // a new bullet must be created
    bullets[++counterBullets] = new Bullet(player.x + player.r / 2, player.y, e.x, e.y);
    //console.log("mouse coordinates are: x=" + e.x + " y=" + e.y);
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
      player.whereGravityStops = player.y +15;
      decrementationOfPlayerY = true;
    }
    else
    {
      player.whereGravityStops = canvasHeight;
    }
  }
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

  // draw the bullets, which still exist
  for(let i=1;i<=counterBullets;i++)
  {
    bullets[i].update();
    bullets[i].show();
  }
}
