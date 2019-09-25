const gamespeed = 150;
let gameTimer;

let canvas;
let ctx; 

const tile = 32;
// const mapSize = [3, 3]; //debug map size
const mapSize = [20, 16]; //original map size
const mapWidth = mapSize[0] * tile;
const mapHeight = mapSize[1] * tile;

let isGameOver = false;
let isGameGoing = false;

let snake = [generateCoordinates()];

let berry = generateCoordinates();
while (!isBerryCoordsValid(snake, berry)) {
    console.log("Alert, regenerating coords");
    berry = generateCoordinates();
}

let currentDirection;
let direction;

const directions = {
    right : "RIGHT",
    left : "LEFT",
    up : "UP",
    down : "DOWN"
}

const keys = {
    right : 37,
    left : 39,
    up : 40,
    down : 38
}


function generateCoordinate (limit) {
    return Math.floor(Math.random() * limit) * tile;
}

function generateCoordinates () {
    return {
        x: generateCoordinate(mapSize[0]),
        y: generateCoordinate(mapSize[1])
    };
}

function render() {
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, mapWidth, mapHeight);
    
    //map
    for (let i = 0; i < mapSize[0]; i++) {
        ctx.beginPath();
        ctx.moveTo(i * tile, 0.5);
        ctx.lineTo(i * tile, mapHeight + 0.5);
          ctx.stroke();
    }   
    for (let i = 0; i < mapSize[1]; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * tile + 0.5);
        ctx.lineTo(mapWidth, i * tile + 0.5);
        ctx.stroke();
    } 

    ctx.beginPath();

    //berry
    ctx.fillStyle = 'red';
    ctx.fillRect(berry.x, berry.y, tile, tile);
    
    //snake body
    for (let i = 1; i < snake.length; i++) {
        ctx.fillStyle = 'green';
        ctx.fillRect(snake[i].x, snake[i].y, tile, tile);
    }

    //snake head
    ctx.fillStyle = 'black';
    ctx.fillRect(snake[0].x, snake[0].y, tile, tile);

    // //score
    // ctx.font = '30px times new roman';
    // ctx.strokeText("Your Score:", mapWidth + 10, 50);
    // ctx.font = '40px times new roman';
    // let scoreSize = ctx.measureText(score);
    // ctx.strokeText(score, (mapWidth + tile * 4.5) - scoreSize.width, tile * 3);

    //GameOver
    if (isGameOver) { 
        ctx.font = '45px times new roman';
        ctx.fillStyle = 'red';
        ctx.fillText("Game Over", mapWidth / 3, mapHeight / 2.2);
    }

    requestAnimationFrame(render);
}

function draw() {
    if (!currentDirection) {
        currentDirection = direction;
    }

    const newCoords = move(snake[0].x, snake[0].y);
    
    currentDirection = direction;

    const head = {
        x : newCoords.x,
        y : newCoords.y
    };  
    
    if (head.x === berry.x && head.y === berry.y) {
         berry = generateCoordinates();
    } else { 
        snake.pop();
    }


    while (!isBerryCoordsValid(snake, berry)) {
        console.log("Alert, regenerating coords");
        berry = generateCoordinates();
    }

    if (snakeCollision(head, snake)) {
        gameOver();
    }

    snake.unshift(head);

    if (bordersCollision(head)) {
        gameOver();
    }

    renderScore(snake.length - 1);
}

//----------------------------Menu parts-------------------------
function gameOver() {
    clearInterval(gameTimer);
    isGameOver = true;
    alert("Your score is " + renderScore(snake.length - 1));
}

function renderScore(score) {
    console.log('score', score);
    return score;
  }

//--------------------------Movement---------------------------
function keyWasPressed(event) {
    if (!isGameGoing) {
        gameTimer = setInterval(draw, gamespeed);
        isGameGoing = true;
    }

    let key = event.keyCode;
    if ( key === keys.right && currentDirection !== directions.right) {
        direction = directions.left;
    } else if (key === keys.down && currentDirection !== directions.down) {
        direction = directions.up;
    } else if (key === keys.left && currentDirection !== directions.left) {
        direction = directions.right;
    } else if (key === keys.up && currentDirection !== directions.up) {
        direction = directions.down;
    } 
}

function move(x, y) {
    //Movement for snake
    if (direction === directions.up) {
        y -= tile;
    }
    if (direction === directions.right) {
        x += tile;
    }
    if (direction === directions.down) {
        y += tile;
    }
    if (direction === directions.left) {
        x -= tile;
    }
    return {x, y};
}

//-------------------------Map Logic---------------------------

function snakeCollision(head,snake) {
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function bordersCollision(head) {
    //if (array[0].x < 0 || array[0].x >= mapWidth || array[0].y < 0 || array[0].y >= mapHeight) {
    if (head.x < 0 || head.x >= mapWidth || head.y < 0 || head.y >= mapHeight) {
        return true;
    }
}

function isBerryCoordsValid(snake, berry) {
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === berry.x && snake[i].y === berry.y) {
            return false;
        }
    }
    return true;
}

//--------------------------Other--------------------------
function resizeCanvas() {
    canvas.width = mapWidth;
    canvas.height = mapHeight;
}

function onLoadComplete() {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    resizeCanvas(); //1. put size of canvas window
    requestAnimationFrame(render); //2. draw objects
    renderScore(0);
}

//---------------------EventListeners----------------------

window.addEventListener('keydown', keyWasPressed);

window.addEventListener('load', onLoadComplete);
