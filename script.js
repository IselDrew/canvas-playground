function Canvas() {
  this.canvas = document.createElement('canvas')
  document.body.appendChild(this.canvas)
  this.ctx = this.canvas.getContext("2d")
  const resize = this.resizeCanvas.bind(this)
  window.addEventListener('resize', resize)
  this.resizeCanvas()
}

Canvas.prototype = {
  draw: function(mapSize, food, snakeLength, path, pixelSize) {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    this.drawMap(mapSize)
    this.drawSnake(snakeLength, path, pixelSize)
    this.drawFood(food, pixelSize)
  },

  drawMap: function(mapSize) {
    this.ctx.strokeRect(0.5, 0.5, mapSize, mapSize)
  },

  drawSnake: function(snakeLength, path, pixelSize) {
    for (let i = 0; i < snakeLength; i++) {
      const index = path.length - 1 - i
      if (index < 0) {
        return
      }
      const pos = path[index]
      this.ctx.beginPath()
      this.ctx.fillStyle = '#4d4d4d'
      this.ctx.fillRect(pos.x, pos.y, pixelSize, pixelSize)
      this.ctx.fill()
    }
  },

  drawFood: function(food, pixelSize) {
    this.ctx.fillStyle = '#c22250'
    this.ctx.fillRect(food.x, food.y, pixelSize, pixelSize)
  },

  resizeCanvas: function() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }
}


function init () {
  const canvas = new Canvas()

  const directions = {
    38: 'up',
    40: 'down',
    37: 'left',
    39: 'right'
  }
  const pixelSize = 32
  const mapSize = 16 * pixelSize
  const gameSpeed = 200
  let food = {}
  let moving
  let snakeLength
  let gameLoop
  let path
  let isPlaying = false

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

  function onLoadComplete() {
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
    canvas.draw(mapSize, food, snakeLength, path, pixelSize)
    requestAnimationFrame(animate)
  }

  function startGame() {
    isPlaying = true
    gameLoop = setInterval(move, gameSpeed)
    generateFood()
  }

  window.addEventListener('keydown', onKeyEvent)
  window.addEventListener('load', onLoadComplete)
}

init()
