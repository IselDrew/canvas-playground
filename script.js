function init () {
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
    recalculatePosition()

    ctx.beginPath()
    ctx.arc(position.x, position.y, 10, 0, 2 * Math.PI)
    ctx.fill()

    requestAnimationFrame(draw)
  }

  function createCanvas() {
    canvas = document.createElement('canvas')
    document.body.appendChild(canvas)
    ctx = canvas.getContext("2d")
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  function setDirection(direction, isActive) {
    if (direction) {
      moving[direction] = isActive
    }
  }

  function recalculatePosition() {
    if (moving.up) {
      position.y -= speed
    } else if (moving.down) {
      position.y += speed
    }
    if (moving.left) {
      position.x -= speed
    } else if (moving.right) {
      position.x += speed
    }
  }

  function onResize() {
    resizeCanvas()
  }

  function onLoadComplete() {
    createCanvas()
    resizeCanvas()
    draw()
  }

  function handleKeyEvent(event) {
    setDirection(directions[event.keyCode], event.type === 'keydown')
  }

  window.addEventListener('keydown', handleKeyEvent)
  window.addEventListener('keyup', handleKeyEvent)
  window.addEventListener('load', onLoadComplete)
  window.addEventListener('resize', onResize)
}

init()
