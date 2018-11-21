const gameTimer = setInterval(draw,125);

let canvas;
let ctx;

let tile = 32;
let mapSize = [22, 16]
let mapWidth = mapSize[0]*tile;
let mapHeight = mapSize[1]*tile;

let snake = [];

function generateCoordinate (limit) {
    return Math.floor(Math.random()*limit) * tile
}

function generateCoordinates () {
    return {
        x : generateCoordinate(mapSize[0]),
        y : generateCoordinate(mapSize[1])
    }
}

snake[0] = generateCoordinates();

let berry = generateCoordinates();


function draw(){
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, mapWidth+(tile*5), mapHeight);

    tileMap();
    
    ctx.beginPath();

    let score = (snake.length-1)*10;

    menu(score);
    
    for(let i = 0; i< snake.length; i++){
        ctx.fillStyle = 'green';
        ctx.fillRect(snake[i].x, snake[i].y, tile, tile);
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(berry.x, berry.y, tile, tile)

    let snakeXcoord = snake[0].x;
    let snakeYcoord = snake[0].y;

    const newCoords = move(snakeXcoord, snakeYcoord);
    
    if(newCoords[0] == berry.x && newCoords[1] == berry.y){
        console.log(score);
        changeBerryPosition(); //berry = generateCoordinates();
    }else{
        snake.pop();
    }
        
    let tale = {
        x : newCoords[0],
        y : newCoords[1]
    }

    snake.unshift(tale);

    if(gameOver(tale)){
        console.log(true);
        clearInterval(gameTimer);
        
        ctx.font = '75px times new roman';
        ctx.fillStyle = 'red'
       // ctx.strokeText();
        ctx.fillText("Game Over", mapWidth/3, mapHeight/2.2);

    }
}

function menu(score){
    ctx.font = '30px times new roman';
    ctx.strokeText("Your Score:", mapWidth+10, 50);
    ctx.font = '40px times new roman';
    let scoreSize = ctx.measureText(score) 
//  console.log(text.width); 
    ctx.strokeText(score, (mapWidth+tile*4.5)-scoreSize.width, tile*3);
}

function gameOver(tale){
    if(snake[0].x < 0){
        return true;
    }
    if(snake[0].y < 0){ 
        return true;
    }    
    if(snake[0].x >= mapWidth){
        return true;
    }
    if(snake[0].y >= mapHeight){
        return true;
    } else {
        return false;
    }
    /*   for(let i = 0; i < tale.length; i++){

        if(tale.x == head[i].x && tale.y == head[i].y){
            return true;
        }
    }
    return false;*/
}


//--------------------------Movement---------------------------
let direction;

function keyWasPressed (event) {
    let key = event.keyCode;
    if( key === 37 && direction !== "RIGHT"){
        direction = "LEFT";
    }else if(key === 38 && direction !== "DOWN"){
        direction = "UP";
    }else if(key === 39 && direction !== "LEFT"){
        direction = "RIGHT";
    }else if(key === 40 && direction !== "UP"){
        direction = "DOWN";
    } 
}

function move(x, y) {
    //Movement for snake
    if (direction === "UP") {
        y -= tile;
    }
    if (direction === "RIGHT") {
        x += tile;
    }
    if (direction === "DOWN") {
        y += tile;
    }
    if (direction === "LEFT") {
        x -= tile;
    }
    const coords = [x, y];

    return coords;
}


function changeBerryPosition(){
    berry = generateCoordinates();
}

//-------------------------Map Logic---------------------------

function tileMap(){
    let snakeMapWidth = 1+mapWidth/tile
    let snakeMapHeight = 1+mapHeight/tile
     for(let i = 0; i < snakeMapWidth; i++){
      ctx.beginPath();
      ctx.moveTo(i*tile, 0+0.5);
      ctx.lineTo(i*tile, mapHeight+0.5);
      ctx.stroke();
    }   
    for(let i = 0; i < snakeMapHeight; i++){
      ctx.beginPath();
      ctx.moveTo(0, i*tile+0.5);
      ctx.lineTo(mapWidth, i*tile+0.5);
      ctx.stroke();
    } 
}


function resizeCanvas() {
    canvas.width = mapWidth+(tile*5);
    canvas.height = mapHeight;
}

function onLoadComplete(){
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    resizeCanvas(); //1. put size of canvas window
    draw(); //2. draw objects
}

//---------------------EventListeners----------------------

window.addEventListener('keydown', keyWasPressed);

window.addEventListener('load', onLoadComplete);