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


function Snake(pixelSize, mapSize, gameSpeed) {
  this.canvas = new Canvas()
  this.directions = {
    38: 'up',
    40: 'down',
    37: 'left',
    39: 'right'
  }
  this.pixelSize = pixelSize
  this.mapSize = mapSize * pixelSize
  this.gameSpeed = gameSpeed
  this.food = {}
  this.isPlaying = false
  this.moving
  this.snakeLength
  this.gameLoop
  this.path
}

Snake.prototype = {
  setDirection: function(direction) {
    if (direction) {
      this.moving = direction
    }
  },

  generateFood: function() {
    const pos = this.generateRandomPosition()
    for (let i = 0; i < this.path.length; i++) {
      const snake = this.path[i]
      if (snake.x === pos.x && snake.y === pos.y) {
        this.generateFood()
        return
      }
    }
    this.food.x = pos.x
    this.food.y = pos.y
  },

  generateRandomPosition: function() {
    return {
      x: this.generateRandomCoordinate(),
      y: this.generateRandomCoordinate()
    }
  },

  generateRandomCoordinate: function() {
    return Math.floor(Math.random() * this.mapSize / this.pixelSize) * this.pixelSize
  },

  getNewPosition: function(dir) {
    const head = this.path[this.path.length - 1]
    const pos = { x: head.x, y: head.y }
    switch (dir) {
      case 'up':
        pos.y -= this.pixelSize
        break
      case 'down':
        pos.y += this.pixelSize
        break
      case 'left':
        pos.x -= this.pixelSize
        break
      case 'right':
        pos.x += this.pixelSize
        break
    }
    return pos
  },

  move: function() {
    const pos = this.getNewPosition(this.moving)
    if (pos.x < 0 || pos.x >= this.mapSize || pos.y < 0 || pos.y >= this.mapSize) {
      this.endGame()
      return
    }
    for (let i = 0; i < this.path.length; i++) {
      const item = this.path[i]
      if (item.x === pos.x && item.y === pos.y) {
        this.endGame()
        return
      }
    }
    const canEat = pos.x === this.food.x && pos.y === this.food.y
    if (canEat) {
      this.feedSnake()
    }
    if (this.path.length === this.snakeLength) {
      this.path.shift()
    }
    this.path.push(pos)
    if (canEat) {
      this.generateFood()
    }
  },

  feedSnake: function() {
    this.snakeLength++
  },

  endGame: function() {
    alert(`GAME OVER. YOUR SCORE: ${this.path.length - 2}`)
    this.isPlaying = false
    clearInterval(this.gameLoop)
  },

  resetGame: function() {
    this.snakeLength = 2
    this.moving = null
    this.food = {}
    this.path = [this.generateRandomPosition()]
  },

  startGame: function() {
    this.isPlaying = true
    const move = this.move.bind(this)
    this.gameLoop = setInterval(move, this.gameSpeed)
    this.generateFood()
  },

  onKeyEvent: function(event) {
    const dir = this.directions[event.keyCode]
    if (!dir) {
      return
    }
    if (!this.moving) {
      this.startGame()
    }
    if (!this.isPlaying) {
      this.resetGame()
      return
    }
    if (this.moving === 'left' && dir === 'right' ||
      this.moving === 'right' && dir === 'left' ||
      this.moving === 'up' && dir === 'down' ||
      this.moving === 'down' && dir === 'up') {
      return
    }
    const pos = this.path[this.path.length - 2]
    const newPos = this.getNewPosition(dir)
    if (pos && pos.x === newPos.x && pos.y === newPos.y) {
      return
    }
    this.setDirection(dir)
  },

  animate: function() {
    this.canvas.draw(this.mapSize, this.food, this.snakeLength, this.path, this.pixelSize)
    const animate = this.animate.bind(this)
    requestAnimationFrame(animate)
  }
}


function init () {
  const snake = new Snake(32, 16, 200)
  const onKeyEvent = snake.onKeyEvent.bind(snake)

  function onLoadComplete() {
    snake.animate()
    snake.resetGame()
  }

  window.addEventListener('keydown', onKeyEvent)
  window.addEventListener('load', onLoadComplete)
}

init()
