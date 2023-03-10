// キャンバスとコンテキストを取得
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// ボールの設定
var ballRadius = 10;
var ballX = canvas.width / 2;
var ballY = canvas.height - 30;
var ballDx = 2;
var ballDy = -2;

// 板の設定
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

// ブロックの設定
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// スコアと残機の設定
var score = 0;
var lives = 3;

// ボールの描写
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// 板の描写
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// ブロックの描写
function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// スコアの描写
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

//ブロックとの衝突を検知
function detectCollision() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (
          ballX > b.x &&
          ballX < b.x + brickWidth &&
          ballY > b.y &&
          ballY < b.y + brickHeight
        ) {
          ballDy = -ballDy;
          b.status = 0;
          score++;
          //勝利宣言
          if (score == brickRowCount * brickColumnCount) {
            alert("You win!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// keyplessの処理
document.addEventListener("keydown", function (event) {
  if (event.key == "ArrowLeft" && paddleX > 0) {
    paddleX -= 7;
  } else if (
    event.key == "ArrowRight" &&
    paddleX < canvas.width - paddleWidth
  ) {
    paddleX += 7;
  }
});

// 処理をキャンバスの中に落とし込む
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawBricks();
  drawScore();
  drawLives();
  detectCollision();

  // ボールが壁に当たった時に反射する処理
  if (
    ballX + ballDx > canvas.width - ballRadius ||
    ballX + ballDx < ballRadius
  ) {
    ballDx = -ballDx;
  }
  if (ballY + ballDy < ballRadius) {
    ballDy = -ballDy;
  } else if (ballY + ballDy > canvas.height - ballRadius) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballDy = -ballDy;
    } else {
      lives--;
      if (lives == 0) {
        alert("Game over!");
        document.location.reload();
      } else {
        ballX = canvas.width / 2;
        ballY = canvas.height - 30;
        ballDx = 3;
        ballDy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // ボールと板の動作の処理
  ballX += ballDx;
  ballY += ballDy;
  requestAnimationFrame(draw);
}

// ゲームを開始する
draw();
