var canvas = document.getElementById("myCanvas");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

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

function Square(position, speed, color,  sizeRect, rotatingSpeed) {
    ColorMoveableObject.apply(this, arguments);
    this.sizeRect = sizeRect;
    this.rotatingSpeed = rotatingSpeed;
    this.angle = 45;
}

Square.prototype = Object.create(ColorMoveableObject.prototype);
Square.prototype.constructor = Square;

Square.prototype.draw = function(context) {
    context.save();
    context.beginPath();
    context.translate(this.position.x + this.sizeRect.x / 2, this.position.y + this.sizeRect.y / 2);
    context.rotate(this.angle * Math.PI / 180);
    
    context.rect(-this.sizeRect.x/2, -this.sizeRect.y/2, this.sizeRect.x, this.sizeRect.y);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
    context.restore();
}

Square.prototype.step = function(width, height) {
    if(this.position.x + this.speed.x > width - this.sizeRect.x || this.position.x + this.speed.x < this.sizeRect.x) {
        this.speed.x = -this.speed.x;
    }
    if(this.position.y + this.speed.y > height - this.sizeRect.y || this.position.y + this.speed.y < this.sizeRect.y) {
        this.speed.y = -this.speed.y;
    }

    this.position.add(this.speed);

    this.angle += this.rotatingSpeed;
}

function ImageObject (position, speed, src, scale) {
    var self = this;
    MoveableObject.apply(this, arguments);
    this.img = new Image();
    this.img.src = src;
    
    this.img.onload = function () {
        self.imgWidth = this.width*scale;
        self.imgHeight = this.height*scale;
    }
    
    console.log("imgHeight :" + this.imgHeight)
}

ImageObject.prototype = Object.create(MoveableObject.prototype);
ImageObject.prototype.constructor = ImageObject;

ImageObject.prototype.draw = function(context) {

    context.drawImage(this.img, this.position.x, this.position.y, this.imgWidth, this.imgHeight);

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

function bezier3 (p1, p2, p3) {

    return function(t) {
        return Math.pow((1 - t), 2) * p1 + 2 * (1 - t) * t * p2 + Math.pow(t, 2) * p3;
    }
}

function bezier4 (p1, p2, p3, p4) {

    return function(t) {
        return Math.pow((1 - t), 3) * p1 + 3 * Math.pow((1-t), 2) * t * p2 + 3 * (1-t) * Math.pow(t, 2)* p3 + Math.pow(t,3)* p4;
    }
}

var bez1x = bezier3(200, 400, 800);
var bez1y = bezier3(400, 800, 400); 

var bez2x = bezier4(100, 340, 600, 780);
var bez2y = bezier4(90, 420, 200, 400);

function drawLine (context, bezierX, bezierY, numPoints) {
    var step = 1 / numPoints;
    var t = 0;
    context.fillStyle = "000000";
    context.fill();
    while (t <= 1) {
        var x = bezierX(t);
        var y = bezierY(t);
        t += step;
        context.lineTo(x, y);
    }
    context.stroke();
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
    new Vector(30, 30),
    1
);

var firsImg = new ImageObject(
    new Vector (canvas.width/2, canvas.height/2),
    new Vector (1, -2),
    "fish13.png",
    1
);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw balls
    firstBall.draw(ctx);
    firstSquare.draw(ctx);
    firsImg.draw(ctx);

    ctx.moveTo(200, 400);
    drawLine(ctx, bez1x, bez1y, 200);
    ctx.moveTo(100, 90);
    drawLine(ctx, bez2x, bez2y, 300);


    // update balls' position
    firstBall.step(canvas.width, canvas.height);
    firstSquare.step(canvas.width, canvas.height);
    firsImg.step(canvas.width, canvas.height);



}

setInterval(draw, 10);