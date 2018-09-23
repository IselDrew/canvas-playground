let canvas
let ctx

const speed = 10

const directions = {
  38: 'up',
  40: 'down',
  37: 'left',
  39: 'right'
}

const position = {
  x: 150,
  y: 100
}

const moving = {
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
  const direction = directions[event.keyCode]
  if (direction) {
    moving[direction] = true
  }
}

function keyWasUnpressed(event) {
  const direction = directions[event.keyCode]
  if (direction) {
    moving[direction] = false
  }
}

function move() {
  if (moving.up) {
    position.y -= speed
  }
  if (moving.down) {
    position.y += speed
  }
  if (moving.left) {
    position.x -= speed
  }
  if (moving.right) {
    position.x += speed
  }
}

function onResize() {
  resizeCanvas()
}

window.addEventListener('keydown', keyWasPressed)
window.addEventListener('keyup', keyWasUnpressed)
window.addEventListener('load', onLoadComplete)
window.addEventListener('resize', onResize)
