//Isn't working script anymore.
let canvas;
let ctx;

let tile = 32;

let mapWidth = 22 * tile;
let mapHeight = 16 * tile;

let snake = [];

snake[0] = {
  x : Math.floor(Math.random() * 22) * tile,
  y : Math.floor(Math.random() * 16) * tile
}

let berry = {
  x : Math.floor(Math.random() * 22) * tile,
  y : Math.floor(Math.random() * 16) * tile
}

const direction = {
    up: false,
    right: false,
    down: false,
    left: false
}

function draw() {
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, mapWidth, mapHeight);
    
    tileMap();

    ctx.beginPath();
    ctx.fillStyle = 'green';
    ctx.fillRect(snake[0].x, snake[0].y, tile, tile);

    ctx.fillStyle = 'red';
    ctx.fillRect(berry.x, berry.y, tile, tile)

    changeBerryPosition();
    collisions();

    requestAnimationFrame(draw)
}

function checkBerryPosition() {
    if (snake[0].x === berry.x && snake[0].y === berry.y) {
        return true;
    } else {
        return false;
    }
}

function changeBerryPosition() {
    if (checkBerryPosition() === true) {
        berry.x = Math.floor(Math.random() * 22) * tile;
        berry.y = Math.floor(Math.random() * 16) * tile;
        //addTail();
    }
}


function tileMap() {
  for (let i = 0; i < mapHeight; i++) {
    ctx.beginPath();
    ctx.moveTo(i * tile, 0 + 0.5);
    ctx.lineTo(i * tile, mapHeight + 0.5);
    ctx.stroke();
  }   
  for (let i = 0; i < mapHeight; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * tile + 0.5);
    ctx.lineTo(mapWidth, i * tile + 0.5);
    ctx.stroke();
  } 
}

function collisions() {
    if (snake[0].x < 0) {
      snake[0].x = 0;
    }
    if (snake[0].y <= 0) {
        snake[0].y = 0;
    }    
    if (snake[0].x >= mapWidth) {
      snake[0].x = mapWidth - tile;
    }
    if (snake[0].y >= mapHeight) {
      snake[0].y = mapHeight - tile;
    }
}

function resizeCanvas() {
    canvas.width = mapWidth;
    canvas.height = mapHeight;
}

function onLoadComplete() {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    // console.log(canvas);
    resizeCanvas();
    draw();
}

function changeDirection() {
  direction.up = false;
  direction.down = false;
  direction.left = false;
  direction.right = false;
}

function keyWasPressed (event) {
      switch (event.keyCode) {
        case 38://up
            direction.up = true;
            break;
        case 40://down
            direction.down = true;
            break;
        case 37://left
            direction.left = true;
            break;
        case 39://right
            direction.right = true;
            break;
    }
}

// function keyWasUnpressed (event) {
//     switch (event.keyCode) {
//         case 38://up
//             direction.up = false
//             break;
//         case 40://down
//             direction.down = false
//             break;
//         case 37://left
//             direction.left = false
//             break;
//         case 39://right
//             direction.right = false
//             break;
//     }
// }


function move () {
    if (direction.up) {
        snake[0].y -= tile;
    }
    if (direction.down) {
        snake[0].y += tile;
    }
    if (direction.left) {
        snake[0].x -= tile;
    }
    if (direction.right) {
      snake[0].x += tile;
    }
}

window.addEventListener('keydown', function(event) {
  changeDirection();
  keyWasPressed(event);
})
// window.addEventListener('keyup', keyWasUnpressed)

window.addEventListener('load', onLoadComplete);

let game = setInterval(move, 125);