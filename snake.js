const gamespeed = 125;
const gameTimer = setInterval(draw, gamespeed);//difficulty());

let canvas;
let ctx; 

const tile = 32;
const mapSize = [22, 16];
const mapWidth = mapSize[0] * tile;
const mapHeight = mapSize[1] * tile;
const scoreSizeZone = 5;

let snake = [];

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

snake[0] = generateCoordinates();

let berry = generateCoordinates();


function draw() {
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, mapWidth  + (tile * scoreSizeZone), mapHeight);

    tileMap();
    
    ctx.beginPath();

    let score = (snake.length - 1) * 10;
 
    menu(score);
    
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = 'green';
        ctx.fillRect(snake[i].x, snake[i].y, tile, tile);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(berry.x, berry.y, tile, tile);

    let newCoords = {
        x : snake[0].x,
        y : snake[0].y 
    }

    newCoords = move(newCoords.x, newCoords.y);
    
    if (newCoords.x === berry.x && newCoords.y === berry.y) {
        console.log(score);
        berry = generateCoordinates();
    } else { 
        snake.pop();
    }
    
    let tail = {
        x : newCoords.x,
        y : newCoords.y
    };  

    if (snakeCollision(tail, snake)) {
        gameOver();
    };

    snake.unshift(tail);

    if (bordersCollision(snake)) {
        gameOver();
    };
}

//----------------------------Menu parts-------------------------
/*
function difficulty() {
    let gameSpeed = 125; //defalut 
    let difficulty = prompt("Choose difficulty:\n(easy, normal, hard, impossible) ").toLowerCase();
        switch (difficulty) {
            case 'easy':
                gameSpeed = 200;
                break;
            case 'normal':
                gameSpeed = 125;
                break;
            case 'hard':
                gameSpeed = 90;
                break;
            case 'impossible':
                gameSpeed = 60;
                break;
        }
        return gameSpeed;
}
*/
function menu(score) {
    ctx.font = '30px times new roman';
    ctx.strokeText("Your Score:", mapWidth + 10, 50);
    ctx.font = '40px times new roman';
    let scoreSize = ctx.measureText(score);
    ctx.strokeText(score, (mapWidth + tile * 4.5) - scoreSize.width, tile * 3);
}

function gameOver() {
//  console.log(true);
    clearInterval(gameTimer);

    ctx.font = '75px times new roman';
    ctx.fillStyle = 'red';
    ctx.fillText("Game Over", mapWidth / 3, mapHeight / 2.2);
}

//--------------------------Movement---------------------------
let direction;

function keyWasPressed(event) {


    let key = event.keyCode;
    if ( key === keys.right && direction !== directions.right) {
        direction = directions.left;
    } else if (key === keys.down && direction !== directions.down) {
        direction = directions.up;
    } else if (key === keys.left && direction !== directions.left) {
        direction = directions.right;
    } else if (key === keys.up && direction !== directions.up) {
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

function snakeCollision(tail,snake) {
    for (let i = 0; i < snake.length; i++) {
        if (tail.x === snake[i].x && tail.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function bordersCollision(array) {
    if (array[0].x < 0 || array[0].x >= mapWidth || array[0].y < 0 || array[0].y >= mapHeight) {
        return true;
    }
}


function tileMap() {
    let snakeMapWidth = 1 + mapWidth/tile;
    let snakeMapHeight = 1 + mapHeight/tile;
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
}


function resizeCanvas() {
    canvas.width = mapWidth + (tile * scoreSizeZone);
    canvas.height = mapHeight;
}

function onLoadComplete() {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    resizeCanvas(); //1. put size of canvas window
    draw(); //2. draw objects
}

//---------------------EventListeners----------------------

window.addEventListener('keydown', keyWasPressed);

window.addEventListener('load', onLoadComplete);
