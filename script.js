function init () {
  let canvas
  let ctx

  const directions = {
    38: 'up',
    40: 'down',
    37: 'left',
    39: 'right'
  }
  const pixelSize = 10
  const mapSize = 20 * pixelSize
  const gameSpeed = 200
  let food = {}
  let moving
  let snakeLength
  let gameLoop
  let path
  let isPlaying = false

  function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    drawMap()
    drawSnake()
    drawFood()
  }

  function drawMap() {
    ctx.strokeRect(0.5, 0.5, mapSize, mapSize)
  }

  function drawSnake() {
    for (let i = 0; i < snakeLength; i++) {
      const index = path.length - 1 - i
      if (index < 0) {
        return
      }
      const pos = path[index]
      ctx.beginPath()
      ctx.fillStyle = '#4d4d4d'
      ctx.fillRect(pos.x, pos.y, pixelSize, pixelSize)
      ctx.fill()
    }
  }

  function drawFood() {
    ctx.fillStyle = '#c22250'
    ctx.fillRect(food.x, food.y, pixelSize, pixelSize)
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
    const pos = generateRandomPosition()
    for (let i = 0; i < path.length; i++) {
      if (path[i].x === pos.x && path[i].y === pos.y) {
        generateFood()
        return
      }
    }
    food.x = pos.x
    food.y = pos.y
  }

  function generateRandomPosition() {
    return {
      x: generateRandomCoordinate(),
      y: generateRandomCoordinate()
    }
  }

  function generateRandomCoordinate() {
    return Math.floor(Math.random() * mapSize / pixelSize) * pixelSize
  }

  function getNewPosition(dir) {
    const head = path[path.length - 1]
    const pos = { x: head.x, y: head.y }
    switch (dir) {
      case 'up':
        pos.y -= pixelSize
        break
      case 'down':
        pos.y += pixelSize
        break
      case 'left':
        pos.x -= pixelSize
        break
      case 'right':
        pos.x += pixelSize
        break
    }
    return pos
  }

  function move() {
    const pos = getNewPosition(moving)
    if (pos.x < 0 || pos.x >= mapSize || pos.y < 0 || pos.y >= mapSize) {
      endGame()
      return
    }
    for (let i = 0; i < path.length; i++) {
      if (path[i].x === pos.x && path[i].y === pos.y) {
        endGame()
        return
      }
    }
    const canEat = pos.x === food.x && pos.y === food.y
    if (canEat) {
      feedSnake()
    }
    if (path.length === snakeLength) {
      path.shift()
    }
    path.push(pos)
    if (canEat) {
      generateFood()
    }
  }

  function feedSnake() {
    snakeLength++
  }

  function endGame() {
    alert(`GAME OVER. YOUR SCORE: ${path.length - 2}`)
    isPlaying = false
    clearInterval(gameLoop)
  }

  function resetGame() {
    snakeLength = 2
    moving = null
    delete food.x
    delete food.y
    path = [generateRandomPosition()]
  }

  function onResize() {
    resizeCanvas()
  }

  function onLoadComplete() {
    createCanvas()
    resizeCanvas()
    animate()
    resetGame()
  }

  function onKeyEvent(event) {
    const dir = directions[event.keyCode]
    if (!dir) {
      return
    }
    if (!moving) {
      startGame()
    }
    if (!isPlaying) {
      resetGame()
      return
    }
    if (moving === 'left' && dir === 'right' ||
      moving === 'right' && dir === 'left' ||
      moving === 'up' && dir === 'down' ||
      moving === 'down' && dir === 'up') {
      return
    }
    const pos = path[path.length - 2]
    const newPos = getNewPosition(dir)
    if (pos && pos.x === newPos.x && pos.y === newPos.y) {
      return
    }
    setDirection(dir)
  }

  function animate() {
    draw()
    requestAnimationFrame(animate)
  }

  function startGame() {
    isPlaying = true
    gameLoop = setInterval(move, gameSpeed)
    generateFood()
  }

  window.addEventListener('keydown', onKeyEvent)
  window.addEventListener('load', onLoadComplete)
  window.addEventListener('resize', onResize)
}

init()
