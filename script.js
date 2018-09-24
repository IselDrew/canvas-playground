function Canvas(px) {
  this.px = px
  this.canvas = document.createElement('canvas')
  document.body.appendChild(this.canvas)
  this.ctx = this.canvas.getContext("2d")
  this.onResize()
  window.addEventListener('resize', this.onResize.bind(this))
}

Canvas.prototype = {
  draw: function(mapSize, food, snakeLength, path) {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    this.drawMap(mapSize)
    this.drawSnake(snakeLength, path)
    this.drawFood(food)
  },

  drawMap: function(mapSize) {
    this.ctx.strokeRect(0.5, 0.5, mapSize * this.px, mapSize * this.px)
  },

  drawSnake: function(snakeLength, path) {
    for (let i = 0; i < snakeLength; i++) {
      const index = path.length - 1 - i
      if (index < 0) {
        return
      }
      const pos = path[index]
      this.drawPoint(pos.x, pos.y, '#4d4d4d')
    }
  },

  drawFood: function(food) {
    this.drawPoint(food.x, food.y, '#c22250')
  },

  drawPoint: function(x, y, color) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(x * this.px, y * this.px, this.px, this.px)
  },

  resizeCanvas: function() {
    this.canvas.width = this.ww
    this.canvas.height = this.wh
  },

  onResize: function() {
    this.ww = window.innerWidth
    this.wh = window.innerHeight
    this.resizeCanvas()
  }
}


function Snake(pixelSize, mapSize, gameSpeed) {
  this.canvas = new Canvas(32)
  this.directions = {
    38: 'up',
    40: 'down',
    37: 'left',
    39: 'right'
  }
  this.pixelSize = pixelSize
  this.mapSize = mapSize
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
    return Math.floor(Math.random() * this.mapSize)
  },

  getNewPosition: function(dir) {
    const head = this.path[this.path.length - 1]
    const pos = { x: head.x, y: head.y }
    switch (dir) {
      case 'up':
        pos.y -= 1
        break
      case 'down':
        pos.y += 1
        break
      case 'left':
        pos.x -= 1
        break
      case 'right':
        pos.x += 1
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
    this.canvas.draw(this.mapSize, this.food, this.snakeLength, this.path)
    // TODO:
    requestAnimationFrame(this.animate.bind(this))
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
