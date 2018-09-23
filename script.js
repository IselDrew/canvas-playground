let canvas
let ctx

let xMovementPosition = 5
let yMovementPosition = 5

const position = {
  x: 150,
  y: 100
}

const direction = {
  up: false,
  right: false,
  down: false,
  left: false
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  move()

  ctx.beginPath()
  ctx.arc(position.x, position.y, 10, 0, 2 * Math.PI)
  ctx.fill()

  requestAnimationFrame(draw)
}


function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function onLoadComplete() {
  canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  ctx = canvas.getContext("2d")
  resizeCanvas()
  draw()
}


function keyWasPressed(event) {
  switch (event.keyCode) {
    //up
    case 38:
      direction.up = true
      break
    //down
    case 40:
      direction.down = true
      break
    //left
    case 37:
      direction.left = true
      break
    //right
    case 39:
      direction.right = true
      break
  }
}

function keyWasUnpressed(event) {
  switch (event.keyCode) {
    //up
    case 38:
      direction.up = false
      break
    //down
    case 40:
      direction.down = false
      break
    //left
    case 37:
      direction.left = false
      break
    //right
    case 39:
      direction.right = false
      break
  }
}

function move() {
  if (direction.up) {
    position.y -= yMovementPosition
  }
  if (direction.down) {
    position.y += yMovementPosition
  }
  if (direction.left) {
    position.x -= xMovementPosition
  }
  if (direction.right) {
    position.x += xMovementPosition
  }
}

function onResize() {
  resizeCanvas()
}

window.addEventListener('keydown', keyWasPressed)
window.addEventListener('keyup', keyWasUnpressed)
window.addEventListener('load', onLoadComplete)
window.addEventListener('resize', onResize)
