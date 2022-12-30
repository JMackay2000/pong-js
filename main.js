const canvasEl = document.getElementById("pongCanvas");
const ctx = canvasEl.getContext("2d");

const canvasWidth = canvasEl.width;
const canvasHeight = canvasEl.height;

const fps = 30;

const mainColour = "white";
const backgroundColour = "black";

let lastp1KeyDown;
let lastp1KeyUp;
let lastp2KeyDown;
let lastp2KeyUp;

let running = false;
let winner = 0; //1 = player 1, 2 = player 2
let p1Score = 0;
let p2Score = 0;
const maxScore = 5;

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
        this.x = this.initialX;
        this.y = this.initialY;
    }
}

class PlayerPaddle extends Paddle {

    constructor(playerNo, x, y) {
        super(playerNo, x, y);
    }

    update() {
        if (lastp1KeyDown || lastp2KeyDown) {
            if (this.playerNo === 1) {
                this.velY = lastp1KeyDown === "w" ? -Paddle.speed : lastp1KeyDown === "s" ? Paddle.speed : 0;
            } else if (this.playerNo === 2) {
                this.velY = lastp2KeyDown === "p" ? -Paddle.speed : lastp2KeyDown === "l" ? Paddle.speed : 0;
            }
            if (this.y + this.velY <= 0 || this.y + Paddle.height + this.velY >= canvasHeight) {
                this.velY = 0;
            } else {
                this.y += this.velY;
            }
        } else {
            if (lastp1KeyUp || lastp2KeyUp) {
                if ((this.playerNo === 1 && ((lastp1KeyUp === "w" || lastp1KeyUp === "s") && lastp1KeyDown === lastp1KeyUp))
                    || (this.playerNo === 2 && (lastp2KeyUp === "p" || lastp2KeyUp === "l" && lastp2KeyDown === lastp2KeyUp))) {
                    this.velY = 0;
                }
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
    const k = e.key;
    if (k === " " || k === "space") {
        if (running) {
            running = false;
            reset();
            p1Score = 0;
            p2Score = 0;
            winner = 0;
        } else {
            running = true;
        }
    }
    if (running) {
        if (k === "w" || k === "s") {
            lastp1KeyDown = k;
            lastp1KeyUp = undefined;
        } else if (k === "p" || k === "l") {
            lastp2KeyDown = k;
            lastp2KeyUp = undefined;
        }
    }
});
document.addEventListener("keyup", (e) => {
    const k = e.key;
    if (running) {
        if (k === "w" || k === "s") {
            lastp1KeyUp = k;
            lastp1KeyDown = undefined;
        } else if (k === "p" || k === "l") {
            lastp2KeyUp = k;
            lastp2KeyDown = undefined;
        }
    }
});
reset();
setInterval(() => {
    clearScreen();
    if (running) {
        drawBackground();
        ball.update();
        p1.update();
        p2.update();
        if (ballIntersects(ball, p1)) {
            calcNewBallSpeed(p1, ball);
        }
        if (ballIntersects(ball, p2)) {
            calcNewBallSpeed(p2, ball);
        }
        if (ball.x - ball.r <= 0) {
            p2Score += 1;
            reset();
        } else if (ball.x + ball.r >= canvasWidth) {
            p1Score += 1;
            reset();
        }
    }
    if (p1Score === maxScore || p2Score === maxScore) {
        running = false;
        winner = p1Score === maxScore ? 1 : 2;
        reset();
        p1Score = 0;
        p2Score = 0;
    }
    ball.render();
    p1.render();
    p2.render();
    if (!running) {
        ctx.fillStyle = "white";
        ctx.font = "100px sans-serif";
        if (winner !== 0) {
            ctx.fillText("Player " + winner + " won!", canvasWidth * 0.325, canvasHeight * 0.20, canvasWidth * 0.4)
        }
        ctx.font = "124px sans-serif";
        ctx.fillText("Press space to play", canvasWidth * 0.1, canvasHeight * 0.35, canvasWidth * 0.8);
    }
}, 1000 / fps);