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
    resizeCanvas: function() {
        this.canvas.width = this.mapWidth;
        this.canvas.height = this.mapHeight;
    },

    renderMap: function() {
        // debugger;
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

    renderSnake: function(snake) {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(snake[0].x, snake[0].y, this.tile, this.tile);
    },

    renderBerry: function(berry) {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(berry.x, berry.y, this.tile, this.tile);
    }
};

function main(){
    canvas = new Canvas(32, [3, 3]);
    canvas.renderMap();
    snake = [ {x: 32, y: 32} ];
    berry = {x: 0, y: 0}
    canvas.renderSnake(snake);    
    canvas.renderBerry(berry);

    // window.addEventListener('load', Snake);
}

main();


