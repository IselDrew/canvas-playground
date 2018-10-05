let canvas;
let ctx;

let xMovementPosition = 5;
let yMovementPosition = 5;
let xPosition = 150;
let yPosition = 100;
let radius = 10;

let tile = 32;

let mapWidth = 22*tile;
let mapHeight = 16*tile;

let snake = [];

snake[0] = {
  x : Math.floor(Math.random()*22) * tile,
  y : Math.floor(Math.random()*16) * tile
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
    move();

    tileMap();


    ctx.beginPath();
    ctx.rect(snake[0].x, snake[0].y, tile, tile );
    ctx.fill();

    collisions();

    requestAnimationFrame(draw)
}

function tileMap(){
  for(let i = 0; i < mapHeight; i++){
    ctx.beginPath();
    ctx.moveTo(i*tile, 0);
    ctx.lineTo(i*tile, mapHeight);
    ctx.stroke();
  }   
  for(let i = 0; i < mapHeight; i++){
    ctx.beginPath();
    ctx.moveTo(0, i*tile);
    ctx.lineTo(mapWidth, i*tile);
    ctx.stroke();
  } 

}

function collisions(){
    // console.log(window.innerWidth)
    // console.log(xPosition)
    if(xPosition < 0){
        xPosition = radius;
    }
    if(yPosition <= 0){
        yPosition = radius;
    }    
    if(xPosition >= window.innerWidth){
        xPosition = window.innerWidth - radius;
    }
    if(yPosition >= window.innerHeight){
        yPosition = window.innerHeight - radius;
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


function keyWasPressed (event) {
    switch (event.keyCode) {
        case 38://up
            direction.up = true
            break;
        case 40://down
            direction.down = true
            break;
        case 37://left
            direction.left = true
            break;
        case 39://right
            direction.right = true
            break;
    }
}

function keyWasUnpressed (event) {
    switch (event.keyCode) {
        case 38://up
            direction.up = false
            break;
        case 40://down
            direction.down = false
            break;
        case 37://left
            direction.left = false
            break;
        case 39://right
            direction.right = false
            break;
    }
}


function move () {
    // console.log(event.keyCode)

    if (direction.up) {
        yPosition -= yMovementPosition;
    }
    if (direction.down) {
        yPosition += yMovementPosition;
    }
    if (direction.left) {
        xPosition -= xMovementPosition;
    }
    if (direction.right) {
        xPosition += xMovementPosition;
    }
}

window.addEventListener('keydown', keyWasPressed)
window.addEventListener('keyup', keyWasUnpressed)

window.addEventListener('load', onLoadComplete);