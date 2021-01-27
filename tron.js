

////////////////////////////////////// snake game tutorial

const board_border = 'black';
const board_background = "white";
const snake_col = 'lightblue';
const snake_border = 'darkblue';
let snake = { x: 0, y: 200 };
let prevTrail = { x: 0, y: 0 };
let currTrail = { x: 0, y: 0 };
const playerSize = 10;
let step = 3;
const trailSize = 1;
let boost = false;


// True if changing direction
let changing_direction = false;
// Horizontal velocity
let dx = step;
// Vertical velocity
let dy = 0;


let goingUp = dy === -step;
let goingDown = dy === step;
let goingRight = dx === step;
let goingLeft = dx === -step;

//default moving right, front hitbox coords are top right and bottom right of player
let hitbox = [{ x: snake.x, y: snake.y }, { x: snake.x+playerSize, y: snake.y+playerSize }];

const snakeboard = document.getElementById("gameCanvas");
snakeboard.width = window.innerWidth * .9;
snakeboard.height = window.innerHeight * .9;
const snakeboard_ctx = gameCanvas.getContext("2d");


let trailMap = [];
for(var row = 0; row < snakeboard.height; row++){
  trailMap[row] = [];
  for(var col = 0; col < snakeboard.width; col++){
    trailMap[row][col] = 0;
  }
}
// Start game
main();

document.addEventListener("keydown", change_direction);
document.addEventListener("keyup", let_go);
    
// main function called repeatedly to keep the game running
function main() {

    if (has_game_ended()) return;

    changing_direction = false;
    setTimeout(function onTick() {
    clearCanvas();
    move_snake();
    calcBoost();
    drawSnake();
    drawTrail();
    // Call main again
    main();
  }, 20)
}

function clearCanvas() {
    //  Select the colour to fill the drawing
    snakeboard_ctx.fillStyle = board_background;
    //  Select the colour for the border of the canvas
    snakeboard_ctx.strokestyle = board_border;
    // Draw a "filled" rectangle to cover the entire canvas
    snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    // Draw a "border" around the entire canvas
    snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
  }


function drawSnake() 
{  
  snakeboard_ctx.fillStyle = snake_col;  
  snakeboard_ctx.strokestyle = snake_border;
  snakeboard_ctx.fillRect(snake.x, snake.y, playerSize, playerSize);  
  snakeboard_ctx.strokeRect(snake.x, snake.y, playerSize, playerSize);

}

function drawTrail(lastX, lastY) {

  snakeboard_ctx.fillStyle = 'green';

  let trailPoints = [];
  for(var row = 0; row < trailMap.length; row++){
    for(var col = 0; col < trailMap[0].length; col++){
      //updates immune trail to not be immune anymore, didnt wanna make an extra double for loop
      if(trailMap[row][col] == 2){
        let immuneSpot = inHitBox(row, col);
        if(!immuneSpot){
          trailMap[row][col] = 1;
        }
      }
      if(trailMap[row][col] == 1){
        snakeboard_ctx.fillRect(col, row, trailSize, trailSize);  
      }
    }
  }
}

function inHitBox(row, col) {
  for(let i = hitbox[0].y; i <= hitbox[1].y; i++){
    for(let j = hitbox[0].x; j <= hitbox[1].x; j++){
      //if row and col are in hitbox, they're immune
      if(row == i && col == j){
        return true;
      }
    }
  }
  return false;
}

function move_snake() {
    
    prevTrail.x = currTrail.x;
    prevTrail.y = currTrail.y;

    snake.x = snake.x + dx;
    snake.y = snake.y + dy;

    currTrail.x = (snake.x+(snake.x+playerSize))/2;
    currTrail.y = (snake.y+(snake.y+playerSize))/2;

    goingUp = dy === -step;
    goingDown = dy === step;
    goingRight = dx === step;
    goingLeft = dx === -step;

    hitbox[0] = { x: snake.x, y: snake.y };
    hitbox[1] = { x: snake.x+playerSize, y: snake.y+playerSize };

    if(goingUp){
      //fill in trail behind you
      for(let i=prevTrail.y; i>currTrail.y; i--){
        trailMap[i][currTrail.x] = 2;
      }
    }

    else if(goingDown){
      //fill in trail behind you
      for(let i=prevTrail.y; i<currTrail.y; i++){
        trailMap[i][currTrail.x] = 2;
      }
    }

    else if(goingLeft){
      //fill in trail behind you
      for(let i=prevTrail.x; i>currTrail.x; i--){
        trailMap[currTrail.y][i] = 2;
      }
    }

    else if(goingRight){
      //fill in trail behind you
      for(let i=prevTrail.x; i<currTrail.x; i++){
        trailMap[currTrail.y][i] = 2;
      }
    }

}

function has_game_ended() {

    const hitLeftWall = snake.x < 0;
    const hitRightWall = snake.x >= snakeboard.width - playerSize;
    const hitTopWall = snake.y < 0;
    const hitBottomWall = snake.y >= snakeboard.height - playerSize;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall || trailHit()
}

function change_direction(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const SPACE_KEY = 32;

    const keyPressed = event.keyCode;

    if(keyPressed === SPACE_KEY){
      boost = true;
      
    }
    
  // Prevent the snake from reversing
    if (changing_direction) return;
    changing_direction = true;
    

    if (keyPressed === LEFT_KEY && !goingRight) {
      dx = -step;
      dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
      dx = 0;
      dy = -step;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
      dx = step;
      dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
      dx = 0;
      dy = step;
    }
}

//return true if player has hit trail
//false if not
function trailHit() {

  for(let i = hitbox[0].y; i <= hitbox[1].y; i++){
    for(let j = hitbox[0].x; j <= hitbox[1].x; j++){
      if(trailMap[i][j] == 1){
        return true;
      }
    }
  }


  return false;
}

function let_go(event) {
  const SPACE_KEY = 32;
  const keyReleased = event.keyCode;

  if(keyReleased === SPACE_KEY){
    boost = false;
  }

}

function calcBoost(){
  if(boost){
    step = 10;
  } else {
    step = 3;
  }

  if (goingRight) {
    dx = step;
    dy = 0;
  }
  if (goingDown) {
    dx = 0;
    dy = step;
  }
  if (goingLeft) {
    dx = -step;
    dy = 0;
  }
  if (goingUp) {
    dx = 0;
    dy = -step;
  }

}