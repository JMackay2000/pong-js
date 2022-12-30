const canvasEl = document.getElementById("pongCanvas");
const ctx = canvasEl.getContext("2d");

const canvasWidth = canvasEl.width;
const canvasHeight = canvasEl.height;

const fps = 30;

const mainColour = "white";
const backgroundColour = "black";

class Paddle {
    static width = 20;
    static height = 100;
    static speed = 10;
    velY = 0;

    constructor(playerNo, x, y) {
        this.playerNo = playerNo;
        this.x = x;
        this.y = y;
    }

    render() {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, Paddle.width, Paddle.height);
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
                this.velY = key === "p" ? -Paddle.speed : key === "l" ? Paddle.speed : 0;
            }
            if (this.y + this.velY <= 0 || this.y + Paddle.height + this.velY >= canvasHeight) {
                this.velY = 0;
            } else {
                this.y += this.velY;
            }
        } else {
            if (key === "w" || key === "s"
                || key === "p" || key === "l") {
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

function ballIntersects(ball, paddle) {
    const intersectX = paddle.playerNo === 1 ? (ball.x - ball.r <= paddle.x + Paddle.width)
        : (ball.x + ball.r >= paddle.x);
    const intersectY = (ball.y - ball.r >= paddle.y && ball.y + ball.r <= paddle.y + Paddle.height);
    return intersectX && intersectY;
}

function calcNewBallSpeed(player, ball) {
    //player = 1 for player 1, 2 for player 2
    const oneThird = Paddle.height / 3;
    ball.velX = player === 1 ? ball.speed : -ball.speed;
    if (ball.y <= p1.y + oneThird) {
        ball.velY = -ball.speed;
    } else if (ball.y >= p1.y + oneThird && ball.y <= p1.y + oneThird * 2) {
        ball.velY = 0;
    } else {
        ball.velY = ball.speed;
    }
}

const p1 = new PlayerPaddle(1, Paddle.width + 10, (canvasHeight / 2) - (Paddle.height / 2));
const p2 = new PlayerPaddle(2, canvasWidth - Paddle.width * 2 - 10, (canvasHeight / 2) - (Paddle.height / 2));
ball.init();

document.addEventListener("keydown", (e) => {
    p1.update(e.key, true);
});
document.addEventListener("keyup", (e) => {
    p1.update(e.key, false);
})

setInterval(() => {
    clearScreen();
    ball.update();
    p1.update();
    p2.update();
    if (ballIntersects(ball, p1)) {
        console.log("ball intersected with player 1");
        calcNewBallSpeed(1, ball);
    }
    if (ballIntersects(ball, p2)) {
        console.log("ball intersected with player 2");
        calcNewBallSpeed(2, ball);
    }
    ball.render();
    p1.render();
    p2.render();
}, 1000 / fps);