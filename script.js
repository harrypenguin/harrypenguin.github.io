var canvas;
var canvasContext;

var ballX=75;
var ballSpeedX =5;
var ballY=75;
var ballSpeedY =5;

var mouseX=0;
var mouseY=0;

const BRICK_W =80;
const BRICK_H=20;
const BRICK_COLUMN = 10; 
const BRICK_GAP=2;
const BRICK_ROWS = 14;
var brickGrid = new Array(BRICK_COLUMN * BRICK_ROWS);
var bricksLeft = 0;

const PADDLE_DIST_FROM_EDGE = 60;
const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
var paddleX =400;

var chancesleft=5;

//BRUH
function updateMousePos(evt){
  var rect = canvas.getBoundingClientRect();
  var root= document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;
  paddleX= mouseX-PADDLE_WIDTH/2;

  //this is a mouse cheat, only activate if ur fixing something
  /*ballX=mouseX;
  ballY=mouseY;
  ballSpeedX=5;
  ballSpeedY=-4;*/
}
// this is how u connect ur mouse movement to the paddle rectangle

function brickReset(){
  bricksLeft = 0;
  var i;
  for(i=0;i<3*BRICK_COLUMN;i++){
    brickGrid[i]=false;
  }
  for(//drawing and empty gutter on the top of te screen
  ;i<BRICK_COLUMN * BRICK_ROWS;i++){
    brickGrid[i]=true;
    bricksLeft++;
   
  }//end of for
}//end of brickReset func

window.onload = function(){
  canvas=document.getElementById('canvas');
  canvasContext = canvas.getContext('2d');

var framesPerSecond = 50;
setInterval(updateAll, 1000/framesPerSecond);

brickReset();
BallReset();

canvas.addEventListener('mousemove', updateMousePos);
//this func runs "updateMousePos " when it detects a mousemove, which is literally what it is
}

function updateAll(){
moveAll();
drawAll();
}

function BallReset(){
  ballX = canvas.width/2;
  ballY = canvas.height/2;
  ballSpeedX=5;
  ballSpeedY=5;
}

function ballMove(){
ballX+=ballSpeedX;
  ballY+=ballSpeedY;

  if(ballX>canvas.width && ballSpeedX>0.0){
    ballSpeedX *=-1;
  }
   if(ballX<0 && ballSpeedX<0.0){
    ballSpeedX *=-1;
  }

  if(ballY>canvas.height){
    BallReset();
    chancesleft--;
  }
   if(ballY<0){
    ballSpeedY *=-1;
  }
  if(chancesleft<=0){
    brickReset();
    chancesleft=5;
  }
}


function ballBrickHandling(){
    var ballBrickCol = Math.floor(ballX/BRICK_W);
  var ballBrickRow = Math.floor(ballY/BRICK_H);
  var brickIndexUnderBall= rowColToArrayIndex(ballBrickCol, ballBrickRow);
 if(ballBrickCol>=0 && 
 ballBrickCol < BRICK_COLUMN && 
 ballBrickRow>=0 && 
 ballBrickRow<BRICK_ROWS){
   if(brickGrid[brickIndexUnderBall]){
   
   brickGrid[brickIndexUnderBall]=false;
   bricksLeft--;
   //console.log(bricksLeft);
   
  var prevBallX = ballX - ballSpeedX;//checks previous positions
  var prevBallY = ballY - ballSpeedY;
  var prevBrickCol = Math.floor(prevBallX/BRICK_W);
  //gets previous column and row
  var prevBrickRow = Math.floor(prevBallY/BRICK_H);

  var bothTestsFailed = true;

  if(prevBrickCol != ballBrickCol){
    var adjBrickSide = rowColToArrayIndex(prevBrickCol, ballBrickRow);


    if(brickGrid[adjBrickSide] == false){
    ballSpeedX *= -1;
    bothTestsFailed = false;
    }
  }//handles it differently if it hit the side or the top and bottom
  if(prevBrickRow != ballBrickRow){
    var adjBrickTopBtm = rowColToArrayIndex(prevBrickCol, ballBrickRow);


    if(brickGrid[adjBrickTopBtm] == false){
    ballSpeedY *= -1;
    bothTestsFailed = false;
  }
  
  }
  if(bothTestsFailed){
    ballSpeedX *= -1;
    ballSpeedY *=-1;
  }

 }
 }
}
 //changes the position of the ball into the form of an index of the array, and erases the brick with that index in the array ps: it also checks the postion of the ball(x and y)to see if it's inbound of the canvas
 //the latter collision detection system is fairly complicated: I cant just flip ballSpeedX or ballSpeedY when a collison happens, we need to know which way the ball came from(what side of the brick did the ball hit?) so it checks the balls position in the previous frame and determines which row/column it was on so it would know which side of the brick it has hit


function ballPaddleHandling(){
  var paddleTopEdgeY = canvas.height-PADDLE_DIST_FROM_EDGE;
  var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
  var paddleRightEdgeX = paddleLeftEdgeX+PADDLE_WIDTH;
  var paddleLeftEdgeX = paddleX;
var paddleTopEdgeY = canvas.height-PADDLE_DIST_FROM_EDGE;
	var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;
	var paddleLeftEdgeX = paddleX;
	var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;
	if( ballY > paddleTopEdgeY && // below the top of paddle
		ballY < paddleBottomEdgeY && // above bottom of paddle
		ballX > paddleLeftEdgeX && // right of the left side of paddle
		ballX < paddleRightEdgeX) { // left of the left side of paddle
		
		ballSpeedY *= -1;

    var centerOfPaddleX = paddleX + PADDLE_WIDTH/2;
    var delta = ballX- centerOfPaddleX;
    ballSpeedX = delta * 0.35;

    if(bricksLeft==0){
      brickReset();//out of bricks and bricks will reappear
    }
	}
  // collision detection with paddle with ball speed control
}

function moveAll(){
  
 ballMove();

 ballBrickHandling();

 ballPaddleHandling();

 //ball move is the function handles how the ball moves, and I have moved the code with different purposes into different seperate functions so it's easier to manage
} 

function rowColToArrayIndex(col,row){
  return col+BRICK_COLUMN*row;
}

function drawBricks(){
  for(var EachRow=0;EachRow<BRICK_ROWS;EachRow++){
  for(var eachCol=0;eachCol<BRICK_COLUMN;eachCol++){

    var arrayIndex = rowColToArrayIndex(eachCol, EachRow);

    if(brickGrid[arrayIndex]//checks if thi current brick in the array is true(present)
    ){
    colorRect(BRICK_W*eachCol,BRICK_H*EachRow,BRICK_W-BRICK_GAP,BRICK_H-BRICK_GAP,'blue');
    }
  }
}
}
function drawAll() {

 colorRect(0,0,canvas.width,canvas.height,'black');

  if(bricksLeft==0){
  colorText("YOU WON, NOW RED SHALL CONQUER THE WORLD.", 5, 300, 'red');
  colorText("FOR THE GLORIOUS MOTHERLAND!", 5, 400, 'red');

  
 }

 colorCircle(ballX,ballY, 10, 'yellow');//draw ball

 colorRect(paddleX, canvas.height-PADDLE_DIST_FROM_EDGE,PADDLE_WIDTH,PADDLE_THICKNESS,'red');

 drawBricks();

 colorText(chancesleft, 700, 50, 'red');

 var score = BRICK_COLUMN*BRICK_ROWS-bricksLeft-30;
 colorText("Your Score is: " + score, 15, 50, 'red');
}

function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor){
  canvasContext.fillStyle=fillColor;
  canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor){
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2, true);
  canvasContext.fill();
  //drawing circle
  
}

function colorText(showWords, textX,textY, fillColor){
  canvasContext.fillStyle=fillColor;
  canvasContext.fillText(showWords,textX,textY);
  canvasContext.font = "40px Impact";
}