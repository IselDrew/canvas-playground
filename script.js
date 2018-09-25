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
    this.ctx.clearRect(0, 0, this.ww, this.wh)
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
  this.canvas = new Canvas(pixelSize)
  this.directions = {
    38: 'up',
    40: 'down',
    37: 'left',
    39: 'right'
  },
  this.offsets = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0]
  },
  this.mapSize = mapSize
  this.gameSpeed = gameSpeed
  this.isPlaying = false
  this.food = []
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
      if (this.collide(snake[0], snake[1], pos[0], pos[1])) {
        this.generateFood()
        return
      }
    }
    this.food = [pos[0], pos[1]]
  },

  generateRandomPosition: function() {
    return [
      this.generateRandomCoordinate(),
      this.generateRandomCoordinate()
    ]
  },

  generateRandomCoordinate: function() {
    return Math.floor(Math.random() * this.mapSize)
  },

  getNewPosition: function(dir) {
    const head = this.path[this.path.length - 1]
    const o = this.offsets[dir]
    return [head[0] + o[0], head[1] + o[1]]
  },

  collideWall: function(x, y) {
    return x < 0 || x >= this.mapSize || y < 0 || y >= this.mapSize
  },

  collideSelf: function(x, y) {
    for (let i = 0; i < this.path.length; i++) {
      const p = this.path[i]
      if (this.collide(p[0], p[1], x, y)) {
        return true
      }
    }
    return false
  },

  collide: function(x1, y1, x2, y2) {
    return x1 === x2 && y1 === y2
  },

  move: function() {
    const pos = this.getNewPosition(this.moving)
    if (this.collideWall(pos[0], pos[1]) ||
        this.collideSelf(pos[0], pos[1])) {
      this.endGame()
      return
    }
    const canEat = this.collide(pos[0], pos[1], this.food[0], this.food[1])
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
      this.canvas.drawPoint(pos[0], pos[1], '#4d4d4d')
    }
  },

  drawFood: function() {
    this.canvas.drawPoint(this.food[0], this.food[1], '#c22250')
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
    this.food = []
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
    if (pos && this.collide(pos[0], pos[1], newPos[0], newPos[1])) {
      return
    }
    this.setDirection(dir)
  },

  animate: function() {
    this.canvas.drawMap(this.mapSize, this.mapSize)
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
