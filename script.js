var assets = {
    logo: 'https://images.icanvas.com/2d/3607.jpg'
};
var images = {};
var canvas

function draw() {
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

    ctx.fillStyle = 'white'; //Dialogue cloud using Bezier curves
    ctx.beginPath();
    ctx.moveTo(510, 7);
    //ctx.quadraticCurveTo(c1x, c1y, x, y)
    ctx.quadraticCurveTo(425, 2, 420, 37);
    ctx.quadraticCurveTo(415, 97, 450, 107);
    ctx.quadraticCurveTo(450, 137, 400, 137);
    ctx.quadraticCurveTo(475, 142, 470, 107);
    ctx.quadraticCurveTo(550, 122, 550, 52);
    ctx.quadraticCurveTo(550, 7, 510, 7);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.shadowOffsetX = 3; //Text with shadow inside of dialogue cloud
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 5;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.fillStyle = 'black';
    ctx.font = '40px Times New Roman';
    ctx.lineWidth = 1;
    ctx.strokeText('2+2=5', 430, 70);

    ctx.shadowColor = 'rgba(0, 0, 0, 0)'; //Blue-black rectangles
    ctx.fillRect(10, 255, 150, 150);   // Draw a rectangle with default settings
    ctx.save();                        // Save the default state
   
    ctx.fillStyle = '#09F';            // Make changes to the settings
    ctx.fillRect(25, 270, 120, 120);   // Draw a rectangle with new settings
    ctx.save();                        // Save the current state

    ctx.fillStyle = '#FFF';            // Make changes to the settings
    ctx.globalAlpha = 0.5; 
    ctx.fillRect(40, 285, 90, 90);     // Draw a rectangle with new settings
  
    ctx.restore();                     // Restore previous state
    ctx.fillRect(55, 300, 60, 60);     // Draw a rectangle with restored settings
  
    ctx.restore();                     // Restore original state
    ctx.fillRect(70, 315, 30, 30);     // Draw a rectangle with restored settings

    for (var i = 0; i < 3; i++) { //few colorful rectangles
        for (var j = 0; j < 3; j++) {
            ctx.save();
            ctx.fillStyle = `rgb(${90 * i}, ${255 - 51 * i}, 255)`;
            ctx.translate(10 + j*30, 10 + i*30);
            ctx.fillRect(168, 275, 25, 25);
            ctx.restore();
        }
    }

    ctx.fillStyle = '#0095DD';
    ctx.fillRect(280, 255, 150, 150);  
    ctx.translate(355, 330);            // translate to rectangle center 
                                        // !x = x + 0.5 * width!
                                        // !y = y + 0.5 * height!
    ctx.rotate((Math.PI / 180) * 45);   // rotate
    ctx.translate(-355, -330);          // translate back

    ctx.fillStyle = '#4D4E53';          // draw grey rect
    ctx.fillRect(280, 255, 150, 150);
}



function onLoadComplete() {
    canvas = document.querySelector('canvas');
    resizeCanvas();
    draw();
}

//makes full-page canvas area
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function loadAssets (hash, callback) {
    var counter = 0;
    var array = Object.keys(hash);

    array.forEach(function(key) {
        var img = new Image();
        img.src = hash[key];

        img.addEventListener('load', function() {
            counter++;
            images[key] = img;
            if (array.length === counter) {
                callback();
            }
        })
    })
}

function KeyPressed() {
    const keyName = event.key;
    switch (event.key) {
        case 'ArrowUp':
            console.log(`You have pressed ${keyName}`);
            break;
        case 'ArrowDown':
            console.log(`You have pressed ${keyName}`);
            break;
        case 'ArrowLeft':
            console.log(`You have pressed ${keyName}`);
            break;
        case 'ArrowRight':
            console.log(`You have pressed ${keyName}`);
            break;
    }
}

window.addEventListener('load', function() {
  loadAssets(assets, onLoadComplete);
});

window.addEventListener('resize', function() {
    resizeCanvas();
    draw();
});

document.addEventListener('keydown', function(event) {
    KeyPressed();
});
