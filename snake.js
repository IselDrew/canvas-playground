const gamespeed = 600;
const gameTimer = setInterval(draw, gamespeed);

let canvas;
let ctx; 

const tile = 32;
const mapSize = [3, 3];
//const mapSize = [20, 16]; //original map size
const mapWidth = mapSize[0] * tile;
const mapHeight = mapSize[1] * tile;

let score = 0;
const scoreSizeZone = 5;

let isGameOver = false;

let snake = [generateCoordinates()];
let head;
let snakeLength = 1;
let berry = generateCoordinates();

let currentDirection = undefined;
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
    ctx.clearRect(0, 0, mapWidth  + (tile * scoreSizeZone), mapHeight);
    
    //map
    let snakeMapWidth = 1 + mapWidth / tile;
    let snakeMapHeight = 1 + mapHeight / tile;
    for (let i = 0; i < snakeMapWidth; i++) {
        ctx.beginPath();
        ctx.moveTo(i * tile, 0.5); //0.5
        ctx.lineTo(i * tile, mapHeight + 0.5);
          ctx.stroke();
    }   
    for (let i = 0; i < snakeMapHeight; i++) {
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

    //snake tail
    for (let i = 1; i < snake.length; i++) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(snake[snake.length - 1].x, snake[snake.length - 1].y, tile, tile);
    }

    //score
    ctx.font = '30px times new roman';
    ctx.strokeText("Your Score:", mapWidth + 10, 50);
    ctx.font = '40px times new roman';
    let scoreSize = ctx.measureText(score);
    ctx.strokeText(score, (mapWidth + tile * 4.5) - scoreSize.width, tile * 3);

    //GameOver
    if (isGameOver) { 
        ctx.font = '75px times new roman';
        ctx.fillStyle = 'red';
        ctx.fillText("Game Over", mapWidth / 3, mapHeight / 2.2);
    }

    requestAnimationFrame(render);
}

function draw() {
    //score = (snake.length - 1) * 10;

    if (!currentDirection) {
        currentDirection = direction;
    }

    const newCoords = move(snake[0].x, snake[0].y);
    
    currentDirection = direction;

    head = {
        x : newCoords.x,
        y : newCoords.y
    };  
    
    let checkBerry = berry; 
    
   // console.log("Before pop:", snake.length); 

    if (head.x === berry.x && head.y === berry.y) {
         checkBerry = generateCoordinates();  
         snakeLength++;
    } else { 
        snake.pop();
    }

    score = (snakeLength - 1) * 10;
   
    // console.log("After pop:", snake.length); 

    while (!isBerryCoordsValid(snake, checkBerry)) {
        console.log("Alert, regenerating coords")
        checkBerry = generateCoordinates();
    }

    berry = checkBerry;

    if (snakeCollision(head, snake)) {
        gameOver();
    }

    snake.unshift(head);

    if (bordersCollision(head)) {
        gameOver();
    }
}

//----------------------------Menu parts-------------------------
function gameOver() {
    clearInterval(gameTimer);
    isGameOver = true;
}

//--------------------------Movement---------------------------
function keyWasPressed(event) {
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

function snakeCollision(objHead,arrSnake) {
    for (let i = 0; i < arrSnake.length - 1; i++) {
        if (objHead.x === arrSnake[i].x && objHead.y === arrSnake[i].y) {
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
    canvas.width = mapWidth + (tile * scoreSizeZone);
    canvas.height = mapHeight;
}

function onLoadComplete() {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    resizeCanvas(); //1. put size of canvas window
    requestAnimationFrame(render); //2. draw objects
}

//---------------------EventListeners----------------------

window.addEventListener('keydown', keyWasPressed);

window.addEventListener('load', onLoadComplete);
