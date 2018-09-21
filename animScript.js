let canvas;
let ctx;

let xMovementPosition = 5;
let yMovementPosition = 5;
let xPosition = 150;
let yPosition = 100;

const direction = {
    up: false,
    right: false,
    down: false,
    left: false
}

function draw() {
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    move();

    ctx.beginPath();
    ctx.arc(xPosition, yPosition, 10, 0, 2 * Math.PI);
    ctx.fill();

    requestAnimationFrame(draw)
}


function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

//1. Diagonal movement
//2. Borders
//3. Speed management
