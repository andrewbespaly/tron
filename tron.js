

////////////////////////////////////// snake game tutorial

const board_border = 'black';
const board_background = "white";
const snake_col = 'lightblue';
const snake_border = 'darkblue';
let snake = { x: 0, y: 200 };
let lastPos = { x: 0, y: 0 };
const playerSize = 10;
const step = 3;
const trailSize = 2;


// True if changing direction
let changing_direction = false;
// Horizontal velocity
let dx = step;
// Vertical velocity
let dy = 0;

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
console.log(snakeboard.width, snakeboard.height);
console.log(trailMap)
// Start game
main();

document.addEventListener("keydown", change_direction);
    
// main function called repeatedly to keep the game running
function main() {

    if (has_game_ended()) return;

    changing_direction = false;
    setTimeout(function onTick() {
    clearCanvas();
    move_snake();
    drawSnake();
    drawTrail();
    // Call main again
    main();
  }, 10)
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

// function drawSnakePart(snakePart) 
// {  
//   snakeboard_ctx.fillStyle = snake_col;  
//   snakeboard_ctx.strokestyle = snake_border;
//   snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);  
//   snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
// }
 
/*Function that prints the parts*/
function drawSnake() 
{  
  snakeboard_ctx.fillStyle = snake_col;  
  snakeboard_ctx.strokestyle = snake_border;
  snakeboard_ctx.fillRect(snake.x, snake.y, playerSize, playerSize);  
  snakeboard_ctx.strokeRect(snake.x, snake.y, playerSize, playerSize);

  // snake.forEach(drawSnakePart);
}

function drawTrail(lastX, lastY) {
  snakeboard_ctx.fillStyle = 'red';  
  snakeboard_ctx.strokestyle = 'pink';
  snakeboard_ctx.fillRect(lastPos.x, lastPos.y, 1, 1);  
  snakeboard_ctx.strokeRect(lastPos.x, lastPos.y, 1, 1);

  snakeboard_ctx.fillStyle = 'green';

  let trailPoints = [];
  for(var row = 0; row < trailMap.length; row++){
    for(var col = 0; col < trailMap[0].length; col++){
      if(trailMap[row][col] == 1){
        snakeboard_ctx.fillRect(col, row, trailSize, trailSize);  
      }
    }
  }


  


}

function move_snake() {
    lastPos.x = (snake.x+(snake.x+playerSize))/2;
    lastPos.y = (snake.y+(snake.y+playerSize))/2;
    trailMap[lastPos.y][lastPos.x] = 1;

    snake.x = snake.x + dx;
    snake.y = snake.y + dy;


}

function has_game_ended() {
    // for (let i = 4; i < snake.length; i++) {
    //   if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true
    // }
    const hitLeftWall = snake.x < 0;
    const hitRightWall = snake.x > snakeboard.width - playerSize;
    const hitToptWall = snake.y < 0;
    const hitBottomWall = snake.y > snakeboard.height - playerSize;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
}

function change_direction(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
  // Prevent the snake from reversing
  
    if (changing_direction) return;
    changing_direction = true;
    const keyPressed = event.keyCode;

    //know the direction you're going
    const goingUp = dy === -step;
    const goingDown = dy === step;
    const goingRight = dx === step;
    const goingLeft = dx === -step;
    //change the velocity to a different direction
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