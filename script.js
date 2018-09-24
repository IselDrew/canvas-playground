function Canvas(px) {
  this.px = px
  this.createCanvas()
  this.onResize()
  window.addEventListener('resize', this.onResize.bind(this))
}

Canvas.prototype = {
  createCanvas: function() {
    this.canvas = document.createElement('canvas')
    document.body.appendChild(this.canvas)
    this.ctx = this.canvas.getContext("2d")
  },

  drawMap: function(x, y) {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    this.ctx.strokeRect(0.5, 0.5, x * this.px, y * this.px)
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
  this.canvas = new Canvas(pixelSize, mapSize)
  this.directions = {
    38: 'up',
    40: 'down',
    37: 'left',
    39: 'right'
  },
  offsets = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0]
  },
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
    const o = this.offsets[dir]
    return { x: head.x + o[0], y: head.y + o[1] }
  },

  checkCollisionWithWall: function(x, y) {
    return x < 0 || x >= this.mapSize || y < 0 || y >= this.mapSize
  },

  checkCollisionWithSelf: function(x, y) {
    for (let i = 0; i < this.path.length; i++) {
      const p = this.path[i]
      if (p.x === x && p.y === y) {
        return true
      }
    }
    return false
  },

  move: function() {
    const pos = this.getNewPosition(this.moving)
    if (this.checkCollisionWithWall(pos.x, pos.y) ||
        this.checkCollisionWithSelf(pos.x, pos.y)) {
      this.endGame()
      return
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

  drawSnake: function() {
    for (let i = 0; i < this.snakeLength; i++) {
      const index = this.path.length - 1 - i
      if (index < 0) {
        return
      }
      const pos = this.path[index]
      this.canvas.drawPoint(pos.x, pos.y, '#4d4d4d')
    }
  },

  drawFood: function() {
    this.canvas.drawPoint(this.food.x, this.food.y, '#c22250')
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
    this.canvas.drawMap(16, 16)
    this.drawSnake()
    this.drawFood()
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
