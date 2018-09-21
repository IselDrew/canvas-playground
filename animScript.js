let canvas;
let ctx;

let xMovementPosition = 5;
let yMovementPosition = 5;
let xPosition = 150;
let yPosition = 100;

function draw()
{
    ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 500, 500);

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


function pressArrowKey(event)
{
    // console.log(event.keyCode)

    switch (event.keyCode)
    {
        case 38:
            yPosition -= yMovementPosition;
            break;
        case 40:
            yPosition += yMovementPosition;
            break;
        case 37:
            xPosition -= xMovementPosition;
            break;
        case 39:
            xPosition += xMovementPosition;
            break;
    }
    // return setInterval(draw, 5); // 5000 = 5 seconds
}

window.addEventListener('keydown', pressArrowKey, true);

window.addEventListener('load', onLoadComplete);

// window.requestAnimationFrame(draw);

//1. Diagonal movement
//2. Borders
//3. Speed management
