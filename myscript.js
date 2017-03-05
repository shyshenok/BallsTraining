var canvas = document.getElementById("myCanvas");

var ctx = canvas.getContext("2d");

var ballRadius = 10;
var heightRect = 20;
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

function Square(position, speed, color,  width, height, rotatingSpeed) {
    ColorMoveableObject.apply(this, arguments);
    this.widthRect = width;
    this.heightRect = height;
    this.rotatingSpeed = rotatingSpeed;
    this.angle = 45;
}

Square.prototype = Object.create(ColorMoveableObject.prototype);
Square.prototype.constructor = Square;

Square.prototype.draw = function(context) {
    context.save();
    context.beginPath();
    context.translate(this.position.x + this.widthRect / 2, this.position.y + this.heightRect / 2);
    context.rotate(this.angle * Math.PI / 180);
    
    context.rect(-this.widthRect/2, -this.heightRect/2, this.widthRect, this.heightRect);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
    context.restore();
}

Square.prototype.step = function(width, height) {
    if(this.position.x + this.speed.x > width - this.widthRect || this.position.x + this.speed.x < this.widthRect) {
        this.speed.x = -this.speed.x;
    }
    if(this.position.y + this.speed.y > height - this.heightRect || this.position.y + this.speed.y < this.heightRect) {
        this.speed.y = -this.speed.y;
    }

    this.position.add(this.speed);

    this.angle += this.rotatingSpeed;
}

function ImageObject (position, speed, src) {
    MoveableObject.apply(this, arguments);
    this.img = new Image();
    this.img.onload = function() {
        console.log("Img has been loaded");
    }
    console.log("loading has been started");
    this.img.src = src;
}

ImageObject.prototype = Object.create(MoveableObject.prototype);
ImageObject.prototype.constructor = ImageObject;

ImageObject.prototype.draw = function(context) {

    context.drawImage(this.img, this.position.x, this.position.y);

}
    
ImageObject.prototype.step = function(width, height) {
    if(this.position.x + this.speed.x > width || this.position.x + this.speed.x < 0) {
        this.speed.x = -this.speed.x;
    }
    if(this.position.y + this.speed.y > height  || this.position.y + this.speed.y < 0) {
        this.speed.y = -this.speed.y;
    }

    this.position.add(this.speed);
}


var firstBall = new Ball(
    new Vector(canvas.width/2, canvas.height-30),
    new Vector(1, -1),
    "#00ff00",
    ballRadius
);

var firstSquare = new Square(
    new Vector(canvas.width/2, canvas.height/2),
    new Vector(1, -1),
    "00fff00",
    widthRect,
    heightRect,
    1
);

var firsImg = new ImageObject(
    new Vector (canvas.width/2, canvas.height/2),
    new Vector (1, -2),
    "fish13.png"
);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw balls
    firstBall.draw(ctx);
    firstSquare.draw(ctx);
    firsImg.draw(ctx);


    // update balls' position
    firstBall.step(canvas.width, canvas.height);
    firstSquare.step(canvas.width, canvas.height);
    firsImg.step(canvas.width, canvas.height);


}

setInterval(draw, 10);