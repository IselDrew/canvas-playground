function Canvas (tile, mapSize) {
    this.mapSize = mapSize;
    this.tile = tile;
    
    this.mapWidth = mapSize[0] * tile;
    this.mapHeight = mapSize[1] * tile;

    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);
    this.resizeCanvas();
    this.ctx = this.canvas.getContext("2d");
  }
  
Canvas.prototype = {
    resizeCanvas: function () {
        this.canvas.width = this.mapWidth;
        this.canvas.height = this.mapHeight;
    },

    renderMap: function () {
        this.ctx.clearRect(0, 0, this.mapWidth, this.mapHeight);

        for (let i = 0; i < this.mapSize[0]; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.tile, 0.5);
            this.ctx.lineTo(i * this.tile, this.mapHeight + 0.5);
            this.ctx.stroke();
        }   
        for (let i = 0; i < this.mapSize[1]; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.tile + 0.5);
            this.ctx.lineTo(this.mapWidth, i * this.tile + 0.5);
            this.ctx.stroke();
        } 
    },

    renderSnake: function (snake) {
        this.ctx.beginPath();
        for (let i = 1; i < snake.length; i++) { //body
            this.ctx.fillStyle = 'green';
            this.ctx.fillRect(snake[i].x, snake[i].y, this.tile, this.tile);
        }
        this.ctx.fillStyle = 'black'; //head
        this.ctx.fillRect(snake[0].x, snake[0].y, this.tile, this.tile);
    },

    renderBerry: function (berry) {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(berry.x, berry.y, this.tile, this.tile);
    }
};


function Snake (tile, mapSize, gameSpeed) {
    this.tile = tile;
    this.mapSize = mapSize;

    this.mapWidth = mapSize[0] * tile;
    this.mapHeight = mapSize[1] * tile;

    this.snake = [this.generateCoordinates()];
    this.berry = this.generateCoordinates();

    this.isGameGoing = false;
    this.isGameOver = false;
    this.gameSpeed = gameSpeed;
    this.gameTimer = null;

    this.currentDirection = null;
    this.direction = null;
   
    this.directions = {
        right : "RIGHT",
        left : "LEFT",
        up : "UP",
        down : "DOWN"
    }
    
    this.keys = {
        right : 37,
        left : 39,
        up : 40,
        down : 38
    }

    this.canvas = new Canvas(32, [3, 3]);

    this.render();  

    window.addEventListener('keydown', this.keyWasPressed.bind(this));
}

Snake.prototype = {
    render: function () {
        this.canvas.renderMap();
        this.canvas.renderBerry(this.berry);
        this.canvas.renderSnake(this.snake);
        requestAnimationFrame(this.render.bind(this));
    },

    game: function () {
        if (!this.currentDirection) {
            this.currentDirection = this.direction;
        }
    
        const newCoords = this.move(this.snake[0].x, this.snake[0].y);
        
        this.currentDirection = this.direction;
    
        const head = {
            x : newCoords.x,
            y : newCoords.y
        };  
        
        if (head.x === this.berry.x && head.y === this.berry.y) {
             this.berry = this.generateCoordinates();
        } else { 
            this.snake.pop();
        }
    
    
        while (!this.isBerryCoordsValid(this.snake, this.berry)) {
            console.log("Alert, regenerating coords");
            this.berry = this.generateCoordinates();
        }
    
        if (this.snakeCollision(head)) {
            this.gameOver();
        }
    
        this.snake.unshift(head);
    
        if (this.bordersCollision(head)) {
            this.gameOver();
        }
    },

    generateCoordinate: function (limit) {
        return Math.floor(Math.random() * limit) * this.tile;
    },

    generateCoordinates: function () {
        return {
            x: this.generateCoordinate(this.mapSize[0]),
            y: this.generateCoordinate(this.mapSize[1])
        };
    },

    isBerryCoordsValid: function () {
        for (let i = 0; i < this.snake.length; i++) {
            if (this.snake[i].x === this.berry.x && this.snake[i].y === this.berry.y) {
                return false;
            }
        }
        return true;
    },    

    snakeCollision: function (head) {
        for (let i = 0; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        return false;
    },
    
    bordersCollision: function (head) {
        if (head.x < 0 || head.x >= this.mapWidth || head.y < 0 || head.y >= this.mapHeight) {
            return true;
        }
    },

    keyWasPressed: function (event) {
        if (!this.isGameGoing) {
            this.gameTimer = setInterval(this.game.bind(this), this.gameSpeed);
            this.isGameGoing = true;
        }
    
        let key = event.keyCode;
        if ( key === this.keys.right && this.currentDirection !== this.directions.right) {
            this.direction = this.directions.left;
        } else if (key === this.keys.down && this.currentDirection !== this.directions.down) {
            this.direction = this.directions.up;
        } else if (key === this.keys.left && this.currentDirection !== this.directions.left) {
            this.direction = this.directions.right;
        } else if (key === this.keys.up && this.currentDirection !== this.directions.up) {
            this.direction = this.directions.down;
        } 
    },
    
    move: function (x, y) {
        //Movement for snake
        if (this.direction === this.directions.up) {
            y -= this.tile;
        }
        if (this.direction === this.directions.right) {
            x += this.tile;
        }
        if (this.direction === this.directions.down) {
            y += this.tile;
        }
        if (this.direction === this.directions.left) {
            x -= this.tile;
        }
        return {x, y};
    },

    scoreCounter: function () {
        return this.snake.length - 1;
    },

    gameOver: function () {
        clearInterval(this.gameTimer);
        this.isGameOver = true;
        alert("Your score is " + this.scoreCounter());
    }, 
};


(function () {
    const snake = new Snake(32, [3, 3], 600);
})();
