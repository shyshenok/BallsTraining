var canvas = document.getElementById("myCanvas");

var ctx = canvas.getContext("2d");

var ballRadius = 10;
var heightRect = 15;
var widthRect = 20;

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.add = function(v) {
    this.x += v.x;
    this.y += v.y;
}

function MoveableObject(position,speed) {
    this.position = position;
    this.speed = speed;
}

MoveableObject.prototype.draw = function(context) {
    throw "Method draw is not implemented";
}

MoveableObject.prototype.step = function(width, height) {
    throw "Method step is not implemented";
}

function ColorMoveableObject(position, speed, color) {
    MoveableObject.apply(this, arguments);
    this.color = color;
}

ColorMoveableObject.prototype = Object.create(MoveableObject.prototype);
ColorMoveableObject.prototype.constructor = ColorMoveableObject;

function Ball(position, speed, color, radius) {
    ColorMoveableObject.apply(this, arguments);
    this.radius = radius;
}

Ball.prototype = Object.create(ColorMoveableObject.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function(context) {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
}

Ball.prototype.step = function(width, height) {
    if(this.position.x + this.speed.x > width - this.radius || this.position.x + this.speed.x < this.radius) {
        this.speed.x = -this.speed.x;
    }
    if(this.position.y + this.speed.y > height - this.radius || this.position.y + this.speed.y < this.radius) {
        this.speed.y = -this.speed.y;
    }
    
    this.position.add(this.speed);
}

function Square(position, speed, color, height, width) {
    ColorMoveableObject.apply(this, arguments);
    this.heightRect = height;
    this.widthRect = width;
}

Square.prototype = Object.create(ColorMoveableObject.prototype);
Square.prototype.constructor = Square;

Square.prototype.draw = function(context) {
    context.beginPath();
    context.rect(this.position.x, this.position.y, this.heightRect, this.widthRect);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
}

Square.prototype.step = function(width, height) {
    if(this.position.x + this.speed.x > width - this.widthRect || this.position.x + this.speed.x < this.widthRect) {
        this.speed.x = -this.speed.x;
    }
    if(this.position.y + this.speed.y > height - this.heightRect || this.position.y + this.speed.y < this.heightRect) {
        this.speed.y = -this.speed.y;
    }
    
    this.position.add(this.speed);
}


var firstBall = new Ball(
    new Vector(canvas.width/2, canvas.height-30),
    new Vector(2, -2),
    "#00ff00",
    ballRadius
);

var firstSquare = new Square(
    new Vector(canvas.width/2, canvas.height/2),
    new Vector(3, -3),
    "00fff00",
    heightRect,
    widthRect
);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw balls
    firstBall.draw(ctx);
    firstSquare.draw(ctx);


    // update balls' position
    firstBall.step(canvas.width, canvas.height);
    firstSquare.step(canvas.width, canvas.height);


}

setInterval(draw, 10);