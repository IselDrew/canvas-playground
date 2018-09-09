var counter = 0;
var assets = {
    logo: 'https://images.icanvas.com/2d/3607.jpg'
};
var images = {};

function createCanvas() {
    var canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth; //makes full-page canvas area
    canvas.height = window.innerHeight;
    return canvas;
}

function draw(canvas) {
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'orange'; //orange rectangle
    ctx.fillRect(10, 10, 100, 100); //x, y, width, height

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; //alpha-rectangular
    ctx.fillRect(110, 10, 100, 100);

    ctx.fillStyle = 'black' //black window
    ctx.fillRect(10, 110, 100, 100);
    ctx.clearRect(30, 130, 60, 60);
    ctx.strokeRect(35, 135, 50, 50); //rectangular outline

    ctx.fillStyle = 'red' //red filled triangle
    ctx.beginPath();
    ctx.moveTo(110, 110);
    ctx.lineTo(210, 210);
    ctx.lineTo(110, 210);
    ctx.fill();

    ctx.beginPath(); //stroke triangle
    ctx.lineWidth = 2;
    ctx.moveTo(110, 110); 
    ctx.lineTo(210, 110);
    ctx.lineTo(210, 210);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath(); // emoji
    //ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise)!
    ctx.lineWidth = 1;
    ctx.arc(60, 160, 25, 0, Math.PI * 2, true); // Outer circle
    ctx.moveTo(80, 160);
    ctx.arc(60, 160, 20, 0, Math.PI, false);  // Mouth (clockwise)
    ctx.moveTo(53, 155);
    ctx.arc(50, 155, 2.5, 0, Math.PI * 2, true);  // Left eye
    ctx.moveTo(73, 155);
    ctx.arc(70, 155, 2.5, 0, Math.PI * 2, true);  // Right eye
    ctx.stroke();

    var lingrad = ctx.createLinearGradient(0, 210 , 210, 0); //Gradient Circle
    lingrad.addColorStop(0, '#00ABEB');
    lingrad.addColorStop(0.6, '#fff');
    ctx.fillStyle = lingrad; 
    ctx.beginPath();
    ctx.arc(160, 160, 25, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.drawImage(images.logo, 210, 10, 300, 200);

    ctx.fillStyle = 'black';
    ctx.font = '48px papyrus';
    ctx.fillText('CANVAS PLAYGROUND', 10, 250);

    ctx.fillText('Hiding text', 450, 50); // why text hides behind the picture?
}

function onLoadComplete() {
    var canvas = createCanvas();
    draw(canvas);
}

function loadAssets (hash, callback) {
    var array = Object.keys(hash);

    array.forEach(function(key) {
        var img = new Image();
        img.src = hash[key];

        img.addEventListener('load', function() {
            ++counter;
            images[key] = img;
            if (array.length === counter) {
                callback();
            }
        })
    })
}

window.addEventListener('load', function() {
    loadAssets(assets, onLoadComplete);
});
