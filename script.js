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
    x: 100,
    y: 100
  }
  let moving
  let wormSections = 2
  const wormSize = 10
  const path = [initialPosition]
  const gameSpeed = 500
  const food = {
    x: undefined,
    y: undefined
  }
  const square = 100

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
    ctx.fillRect(food.x, food.y, wormSize, wormSize)
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

  function generateFood() {
    food.x = Math.floor(Math.random() * square / wormSize) * wormSize
    food.y = Math.floor(Math.random() * square / wormSize) * wormSize
  }

  function recalculatePosition() {
    const head = path[path.length - 1]
    const pos = { x: head.x, y: head.y }
    switch (moving) {
      case 'up':
        pos.y -= wormSize
        break
      case 'down':
        pos.y += wormSize
        break
      case 'left':
        pos.x -= wormSize
        break
      case 'right':
        pos.x += wormSize
        break
    }
    if (pos.x === food.x && pos.y === food.y) {
      wormSections++
      generateFood()
    }
    if (path.length === wormSections) {
      path.shift()
    }
    path.push(pos)
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
      generateFood()
    }
    const dir = directions[event.keyCode]
    if (moving === 'left' && dir === 'right' ||
      moving === 'right' && dir === 'left' ||
      moving === 'up' && dir === 'down' ||
      moving === 'down' && dir === 'up') {
      return
    }
    setDirection(dir)
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
