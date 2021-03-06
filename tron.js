
const board_border = "black";
const board_background = "white";
const playerSize = 10;
// let step = 1;
const trailSize = 1;

class player_obj {
  constructor(name, color, position, direction) {
    this.player_name = name;
    this.player_color = color;
    this.player_border_color = "black";
    this.player_pos = position;
    this.alive = true;
    this.step = 3    ;
    // (this.player_pos = { x: 0, y: 0 }),
    this.hitbox = [
      { x: 0, y: 0 },
      { x: 0, y: 0 }
    ]; //hitbox, top left corner to bottom right corner of player
    this.prevTrail_pos = { x: 0, y: 0 };
    this.currTrail_pos = { x: position.x, y: position.y };
    this.boost = false;
    this.changing_direction = false;

    if (direction == 'up') {
      this.dx = 0;
      this.dy = -this.step;
      this.directions = { up: true, right: false, down: false, left: false };
    }
    else if (direction == 'right') {
      this.dx = this.step;
      this.dy = 0;
      this.directions = { up: false, right: true, down: false, left: false };
    }
    else if (direction == 'down') {
      this.dx = 0;
      this.dy = this.step;
      this.directions = { up: false, right: false, down: true, left: false };
    }
    else if (direction == 'left') {
      this.dx = -this.step;
      this.dy = 0;
      this.directions = { up: false, right: false, down: false, left: true };
    }


  }
};

let playerList = [];

let player1 = new player_obj('andrew', 'red', {x: 500, y: 500}, 'down');
let player2 = new player_obj('ethan', 'green', {x: 900, y: 800}, 'up');

playerList.push(player1, player2);


const gameboard = document.getElementById("gameCanvas");
gameboard.width = window.innerWidth * 0.9;
gameboard.height = window.innerHeight * 0.9;
const gameboard_ctx = gameCanvas.getContext("2d");

let trailMap = [];
for (var row = 0; row < gameboard.height; row++) {
  trailMap[row] = [];
  for (var col = 0; col < gameboard.width; col++) {
    trailMap[row][col] = 0;
  }
}
// Start game
main();

document.addEventListener("keydown", change_direction);
document.addEventListener("keyup", let_go);

// main function called repeatedly to keep the game running
function main() {

  
  // changing_direction = false;

  setTimeout(function onTick() {
    if(gameEnded()){ 
      gameboard_ctx.font = "40px Arial";
      gameboard_ctx.textAlign = "center";
      gameboard_ctx.fillStyle = 'Red';
      gameboard_ctx.fillText("GAME OVER", gameboard.width/2, gameboard.height/2);
      return;
    };
    clearCanvas();
    
    move_player();
    checkAlive();
    calcBoost();
    drawPlayer();
    drawTrail();
    // Call main again
    main();
  }, 20);
}

function clearCanvas() {
  //  Select the colour to fill the drawing
  gameboard_ctx.fillStyle = board_background;
  //  Select the colour for the border of the canvas
  gameboard_ctx.strokestyle = board_border;
  // Draw a "filled" rectangle to cover the entire canvas
  gameboard_ctx.fillRect(0, 0, gameboard.width, gameboard.height);
  // Draw a "border" around the entire canvas
  gameboard_ctx.strokeRect(0, 0, gameboard.width, gameboard.height);
}

function drawPlayer() {
  
  playerList.forEach(player => {
    gameboard_ctx.fillStyle = player.player_color;
    gameboard_ctx.strokestyle = player.player_border_color;
    gameboard_ctx.fillRect(player.player_pos.x, player.player_pos.y, playerSize, playerSize);
    gameboard_ctx.strokeRect(player.player_pos.x, player.player_pos.y, playerSize, playerSize);
  })
  
}

function drawTrail() {

  playerList.forEach(player => {
    
    // let trailPoints = [];
    for (var row = 0; row < trailMap.length; row++) {
      for (var col = 0; col < trailMap[0].length; col++) {
        //updates immune trail to not be immune anymore, didnt wanna make an extra double for loop
        if (trailMap[row][col] == 2) {
          let immuneSpot = inHitBox(row, col);
          if (!immuneSpot) {
            trailMap[row][col] = 1;
          }
        }
        if (trailMap[row][col] == 1) {
          gameboard_ctx.fillStyle = player.player_color;
          gameboard_ctx.fillRect(col, row, trailSize, trailSize);
        }
      }
    }
  })

}

//check if any players are in this spot
function inHitBox(row, col) {
  return inPlayerHitbox = playerList.some(player => 
    player.hitbox[0].y <= row &&
    row <= player.hitbox[1].y &&
    player.hitbox[0].x <= col &&
    col <= player.hitbox[1].x
  )
}

function move_player() {
  playerList.forEach(player => {
    //move only alive players
    if(player.alive){

      player.prevTrail_pos.x = player.currTrail_pos.x;
      player.prevTrail_pos.y = player.currTrail_pos.y;

      player.player_pos.x = player.player_pos.x + player.dx;
      player.player_pos.y = player.player_pos.y + player.dy;

      //reset changedirection so player can move again
      player.changing_direction = false;

      player.currTrail_pos.x = (player.player_pos.x + (player.player_pos.x + playerSize)) / 2;
      player.currTrail_pos.y = (player.player_pos.y + (player.player_pos.y + playerSize)) / 2;

      player.directions.up = player.dy === -player.step;
      player.directions.right = player.dx === player.step;
      player.directions.down = player.dy === player.step;
      player.directions.left = player.dx === -player.step;

      player.hitbox[0] = { x: player.player_pos.x, y: player.player_pos.y };
      player.hitbox[1] = { x: player.player_pos.x + playerSize, y: player.player_pos.y + playerSize };

      if(player.currTrail_pos.x > gameboard.width){ player.currTrail_pos.x = gameboard.width-1}
      if(player.currTrail_pos.y > gameboard.height){ player.currTrail_pos.y = gameboard.height-1}

      if (player.directions.up) {
        //fill in trail behind you
        for (let i = player.prevTrail_pos.y; i > player.currTrail_pos.y; i--) {
          trailMap[i][player.currTrail_pos.x] = 2;
        }
      } else if (player.directions.down) {
        //fill in trail behind you
        for (let i = player.prevTrail_pos.y; i < player.currTrail_pos.y; i++) {
          trailMap[i][player.currTrail_pos.x] = 2;
        }
      } else if (player.directions.left) {
        //fill in trail behind you
        for (let i = player.prevTrail_pos.x; i > player.currTrail_pos.x; i--) {
          trailMap[player.currTrail_pos.y][i] = 2;
        }
      } else if (player.directions.right) {
        //fill in trail behind you
        for (let i = player.prevTrail_pos.x; i < player.currTrail_pos.x; i++) {
          trailMap[player.currTrail_pos.y][i] = 2;
        }
      }
    }
  })

}


//directions have to be for specific player
function change_direction(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;
  const SPACE_KEY = 32;

  const keyPressed = event.keyCode;

  if (keyPressed === SPACE_KEY) {
    player1.boost = true;
  }

  // Prevent the snake from reversing
  if (player1.changing_direction) return;
  player1.changing_direction = true;

  if (keyPressed === LEFT_KEY && !player1.directions.right) {
    player1.dx = -player1.step;
    player1.dy = 0;
  }
  if (keyPressed === UP_KEY && !player1.directions.down) {
    player1.dx = 0;
    player1.dy = -player1.step;
  }
  if (keyPressed === RIGHT_KEY && !player1.directions.down.left) {
    player1.dx = player1.step;
    player1.dy = 0;
  }
  if (keyPressed === DOWN_KEY && !player1.directions.up) {
    player1.dx = 0;
    player1.dy = player1.step;
  }
}


function let_go(event) {
  const SPACE_KEY = 32;
  const keyReleased = event.keyCode;

  if (keyReleased === SPACE_KEY) {
    player1.boost = false;
  }
}

function calcBoost() {
  if (player1.boost) {
    player1.step = 10;
  } else {
    player1.step = 3;
  }

  if (player1.directions.right) {
    player1.dx = player1.step;
    player1.dy = 0;
  }
  if (player1.directions.down) {
    player1.dx = 0;
    player1.dy = player1.step;
  }
  if (player1.directions.left) {
    player1.dx = -player1.step;
    player1.dy = 0;
  }
  if (player1.directions.up) {
    player1.dx = 0;
    player1.dy = -player1.step;
  }
}

const checkAlive = () => {
  playerList.forEach(player => {
    //if player hit wall
    const hitLeftWall = player.player_pos.x < 0;
    const hitRightWall = player.player_pos.x >= gameboard.width - playerSize;
    const hitTopWall = player.player_pos.y < 0;
    const hitBottomWall = player.player_pos.y >= gameboard.height - playerSize;

    if( hitLeftWall || hitRightWall || hitTopWall || hitBottomWall ){
      player.alive = false;
      return;
    }

    //if player hit trail
    for (let i = player.hitbox[0].y; i <= player.hitbox[1].y; i++) {
      for (let j = player.hitbox[0].x; j <= player.hitbox[1].x; j++) {
        if (trailMap[i][j] == 1) {
          player.alive = false;
        }
      }
    }

  })
}

const gameEnded = () => {
  return playerList.every(player => !player.alive);
}