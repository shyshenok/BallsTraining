var canvas = document.getElementById("myCanvas");

var ctx = canvas.getContext("2d");
var ballRadius = 10;

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.add = function(v) {
    this.x += v.x;
    this.y += v.y;
}


function Ball(position, speed, radius, color) {
    this.position = position;
    this.speed = speed;
    this.ballRadius = radius;
    this.colorBall = color;
}



Ball.prototype.draw = function(context) {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.ballRadius, 0, Math.PI*2);
    context.fillStyle = this.colorBall;
    context.fill();
    context.closePath();
}

Ball.prototype.step = function(width, height) {
    if(this.position.x + this.speed.x > width - this.ballRadius || this.position.x + this.speed.x < this.ballRadius) {
        this.speed.x = -this.speed.x;
    }
    if(this.position.y + this.speed.y > height - this.ballRadius || this.position.y + this.speed.y < this.ballRadius) {
        this.speed.y = -this.speed.y;
    }
    
    this.position.add(this.speed);

}

var firstBall = new Ball(
    new Vector(canvas.width/2, canvas.height-30),
    new Vector(2, -2),
    ballRadius,
    "#00ff00"
);

var secondBall = new Ball(
    new Vector(canvas.width/2, canvas.height/23),
    new Vector(4, -4), 
    ballRadius * 2,
    "#ff0000"
);

var thirdBall = new Ball(
    new Vector(canvas.width/2, canvas.height/2),
    new Vector(2.5, -2.5),
    ballRadius *1.5,
    "#0000FF"
);


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    // draw balls
    firstBall.draw(ctx);
    secondBall.draw(ctx);
    thirdBall.draw(ctx);

    // update balls' position
    firstBall.step(canvas.width, canvas.height);
    secondBall.step(canvas.width, canvas.height);
    thirdBall.step(canvas.width, canvas.height)

}

setInterval(draw, 10);