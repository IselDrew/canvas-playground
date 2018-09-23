function init () {
  let canvas
  let ctx

  const directions = {
    38: 'up',
    40: 'down',
    37: 'left',
    39: 'right'
  }
  const initialPosition = {
    x: 150,
    y: 100
  }
  let moving
  let wormSections = 10
  const wormSize = 10
  const path = [initialPosition]
  const gameSpeed = 200

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    drawWorm()
    drawFood()
  }

  function drawWorm() {
    for (let i = 0; i < wormSections; i++) {
      const index = path.length - 1 - i
      if (index < 0) {
        return
      }
      const pos = path[index]
      ctx.beginPath()
      ctx.fillStyle = '#4d4d4d'
      ctx.fillRect(pos.x, pos.y, wormSize, wormSize)
      ctx.fill()
    }
  }

  function drawFood() {
    ctx.fillStyle = '#c22250'
    ctx.fillRect(100, 200, wormSize, wormSize)
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

  function setDirection(direction) {
    if (direction) {
      moving = direction
    }
  }

  function recalculatePosition() {
    const head = path[path.length - 1]
    const position = { x: head.x, y: head.y }
    switch (moving) {
      case 'up':
        position.y -= wormSize
        break
      case 'down':
        position.y += wormSize
        break
      case 'left':
        position.x -= wormSize
        break
      case 'right':
        position.x += wormSize
        break
    }
    if (path.length === wormSections) {
      path.shift()
    }
    path.push(position)
  }

  function onResize() {
    resizeCanvas()
  }

  function onLoadComplete() {
    createCanvas()
    resizeCanvas()
    animate()
  }

  function onKeyEvent(event) {
    if (!moving) {
      setInterval(recalculatePosition, gameSpeed)
    }
    setDirection(directions[event.keyCode])
  }

  function animate() {
    draw()
    requestAnimationFrame(animate)
  }

  window.addEventListener('keydown', onKeyEvent)
  window.addEventListener('load', onLoadComplete)
  window.addEventListener('resize', onResize)
}

init()
