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
}

window.onmouseup = function()
{
  //console.log("mouse was released");
  Keys.click = false;
}

function distanceBetween(firstPointX, firstPointY, secondPointX, secondPointY)
{
  return Math.sqrt(Math.pow(firstPointX-secondPointX, 2) + Math.pow(firstPointY-secondPointY, 2));
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
      if(distanceBetween(mousseX, mousseY, lastPointX, lastPointY)>=walls[wallNumber].circleRadius)
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

function shouldTheGravityStop()
{
  // if a wall touches the coordinates the player, then the gravity must stop its effect on the player
  for(let i=1;i<=wallNumber;i++)
  {
    for(let j=1;j<=walls[i].numberOfDots;j++)
    {
      if(playerIsJumping==true)
      {
        if(distanceBetween(player.x, player.y-player.r, walls[i].coordonatesOfDots[j].x, walls[i].coordonatesOfDots[j].y + walls[i].circleRadius)<=7)
        {
          //console.log("the wall number " + i + " was touched while jumping");
          player.y = walls[i].coordonatesOfDots[j].y + walls[i].circleRadius;
          player.delta = 51;
        }
      }
      else if(playerIsFalling==true)
      {
        if(distanceBetween(player.x, player.y+player.r, walls[i].coordonatesOfDots[j].x, walls[i].coordonatesOfDots[j].y - walls[i].circleRadius)<=7)
        {
          //console.log("the wall number " + i + " was touched while falling");
          player.delta = 51;
        }
      }
    }
  }
}

function drawEveryWall()
{
  // draw every single wall
  for(let i=1;i<=wallNumber;i++)
  {
    walls[i].show();
  }
}

function draw() {
  //frameRate(200);
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
  
  player.show();
  drawEveryWall();
  shouldTheGravityStop();
  player.MIN_Y = 999999999;
}
