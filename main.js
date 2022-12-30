const canvasEl = document.getElementById("pongCanvas");
const ctx = canvasEl.getContext("2d");

const canvasWidth = canvasEl.width;
const canvasHeight = canvasEl.height;

const fps = 30;

const mainColour = "white";
const backgroundColour = "black";

let p1Score = 0;
let p2Score = 0;

class Paddle {
    static width = 20;
    static height = 100;
    static speed = 10;
    velY = 0;
    initialX;
    initialY;
    constructor(playerNo, x, y) {
        this.playerNo = playerNo;
        this.x = x;
        this.y = y;
        this.initialX = x;
        this.initialY = y;
    }

    render() {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, Paddle.width, Paddle.height);
    }

    reset() {
        this.x = initialX;
        this.y = initialY;
    }
}

class PlayerPaddle extends Paddle {

    constructor(playerNo, x, y) {
        super(playerNo, x, y);
    }

    update(key, keyDown) {
        if (keyDown) {
            if (this.playerNo === 1) {
                this.velY = key === "w" ? -Paddle.speed : key === "s" ? Paddle.speed : 0;
            } else {
                this.velY = key === "a" ? -Paddle.speed : key === "d" ? Paddle.speed : 0;
            }
            if (this.y + this.velY <= 0 || this.y + Paddle.height + this.velY >= canvasHeight) {
                this.velY = 0;
            } else {
                this.y += this.velY;
            }
        } else {
            if (key === "w" || key === "s"
                || key === "a" || key === "d") {
                this.velY = 0;
            }
        }
    }
}

const ball = {
    r: 10,
    speed: 10,
    velX: 0,
    velY: 0,
    x: 0,
    y: 0,
    init() {
        this.x = canvasWidth / 2 - this.r / 2;
        this.y = canvasHeight / 2 - this.r / 2;
        this.velX = -this.speed;
        this.velY = 0;
    },
    update() {
        if (this.y - this.r <= 0) {
            this.velY = this.speed;
        } else if (this.y + this.r >= canvasHeight) {
            this.velY = -this.speed;
        }
        this.x += this.velX;
        this.y += this.velY;
    },
    render() {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }
}

function clearScreen() {
    ctx.fillStyle = backgroundColour;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

function drawBackground() {
    //calc middle of canvas
    const midX = canvasWidth / 2;
    const dlw = Math.floor(canvasWidth * 0.02);
    const x = midX - (dlw / 2);
    const p = 10;
    const pdl = 15;
    const n = 10;
    const dlh = (canvasHeight - p - pdl * n) / n;
    ctx.fillStyle = "white";
    for (let i = 0; i < n; i++) {
        const y = p + (i * dlh) + (i * pdl);
        ctx.fillRect(x, y, dlw, dlh);
    }

    const scoreMaxWidth = 100;
    //draw scores
    const x1 = canvasWidth * 0.20;
    const y1 = canvasHeight * 0.2;
    ctx.font = "124px sans-serif";
    ctx.fillText(p1Score, x1, y1, scoreMaxWidth);

    const x2 = canvasHeight * 0.80 - scoreMaxWidth / 2;
    const y2 = y1;
    ctx.fillText(p2Score, x2, y2, scoreMaxWidth);
}

function ballIntersects(ball, paddle) {
    const intersectX = paddle.playerNo === 1 ? (ball.x - ball.r <= paddle.x + Paddle.width)
        : (ball.x + ball.r >= paddle.x);
    const intersectY = (ball.y - ball.r >= paddle.y && ball.y + ball.r <= paddle.y + Paddle.height);
    return intersectX && intersectY;
}

function calcNewBallSpeed(paddle, ball) {
    //player = 1 for player 1, 2 for player 2
    const oneThird = Paddle.height / 3;
    ball.velX = paddle.playerNo === 1 ? ball.speed : -ball.speed;
    if (ball.y <= paddle.y + oneThird) {
        ball.velY = -ball.speed;
    } else if (ball.y >= paddle.y + oneThird && ball.y <= paddle.y + oneThird * 2) {
        ball.velY = 0;
    } else {
        ball.velY = ball.speed;
    }
}

const p1 = new PlayerPaddle(1, Paddle.width + 10, (canvasHeight / 2) - (Paddle.height / 2));
const p2 = new PlayerPaddle(2, canvasWidth - Paddle.width * 2 - 10, (canvasHeight / 2) - (Paddle.height / 2));
ball.init();

function reset() {
    ball.init();
    p1.reset();
    p2.reset();
}



document.addEventListener("keydown", (e) => {
    p1.update(e.key, true);
    p2.update(e.key, true);
});
document.addEventListener("keyup", (e) => {
    p1.update(e.key, false);
    p2.update(e.key, false);
})

setInterval(() => {
    clearScreen();
    drawBackground();
    ball.update();
    p1.update();
    p2.update();
    if (ballIntersects(ball, p1)) {
        console.log("ball intersected with player 1");
        calcNewBallSpeed(p1, ball);
    }
    if (ballIntersects(ball, p2)) {
        console.log("ball intersected with player 2");
        calcNewBallSpeed(p2, ball);
    }
    if (ball.x - ball.r <= 0) {
        p1Score += 1;
        reset();
    } else if (ball.x + ball.r >= canvasWidth) {
        p2Score += 1;
        reset();
    }
    ball.render();
    p1.render();
    p2.render();
}, 1000 / fps);