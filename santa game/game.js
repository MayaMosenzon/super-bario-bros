const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// מסך פתיחה
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");

// כפתור שחק שוב
const restartBtn = document.getElementById("restartBtn");

// --- תמונות ---
const santaImg = new Image();
santaImg.src = "images/santa.png";

const bottleImg = new Image();
bottleImg.src = "images/bottle.png";

const bombImg = new Image();
bombImg.src = "images/bomb.png";

const backgroundImg = new Image();
backgroundImg.src = "images/background.png";

// --- משתני משחק ---
const santa = {
  x: 180,
  y: 530,
  width: 60,
  height: 60,
  speed: 5
};

let bottles = [];
let bombs = [];
let score = 0;
let difficultyLevel = 1;
let gameOver = false;

// --- תנועה עם גבולות ---
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") {
    santa.x -= santa.speed;
    if (santa.x < 0) santa.x = 0;
  }
  if (e.key === "ArrowRight") {
    santa.x += santa.speed;
    if (santa.x + santa.width > canvas.width) {
      santa.x = canvas.width - santa.width;
    }
  }
});

// --- התנגשות ---
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// --- בקבוק ---
function dropBottle() {
  const x = Math.random() * (canvas.width - 30);
  const baseSpeed = 1.5 + Math.random();
  const speed = baseSpeed + difficultyLevel * 0.5;
  bottles.push({ x, y: 0, width: 30, height: 60, speed });
}

// --- פצצה ---
function dropBomb() {
  const x = Math.random() * (canvas.width - 30);
  const baseSpeed = 1.5 + Math.random();
  const speed = baseSpeed + difficultyLevel * 0.5;
  bombs.push({ x, y: 0, width: 30, height: 60, speed });
}

// --- ציור המשחק ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  // סנטה
  ctx.drawImage(santaImg, santa.x, santa.y, santa.width, santa.height);

  // בקבוקים
  bottles.forEach((bottle, index) => {
    bottle.y += bottle.speed;
    ctx.drawImage(bottleImg, bottle.x, bottle.y, bottle.width, bottle.height);

    if (isColliding(santa, bottle)) {
      score++;
      bottles.splice(index, 1);
    } else if (bottle.y > canvas.height) {
      bottles.splice(index, 1);
    }
  });

  // פצצות
  bombs.forEach((bomb, index) => {
    bomb.y += bomb.speed;
    ctx.drawImage(bombImg, bomb.x, bomb.y, bomb.width, bomb.height);

    if (isColliding(santa, bomb)) {
      gameOver = true;
    } else if (bomb.y > canvas.height) {
      bombs.splice(index, 1);
    }
  });

  // ניקוד
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  // מסך סיום
  if (gameOver) {
    ctx.font = "bold 48px 'Comic Sans MS', cursive, sans-serif";
    ctx.textAlign = "center";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "red";
    ctx.fillStyle = "white";
    ctx.strokeText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    restartBtn.style.display = "block";
    restartBtn.classList.add("show-pop");
  }
}

// --- לולאת משחק ---
function gameLoop() {
  draw();
  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// --- התחלת המשחק (כשלוחצים על Start Game) ---
function startGame() {
  startScreen.style.display = "none";
  gameLoop();
}

// --- איפוס המשחק (כשלוחצים שחק שוב) ---
function resetGame() {
  bottles = [];
  bombs = [];
  score = 0;
  difficultyLevel = 1;
  santa.x = 180;
  santa.speed = 5;
  gameOver = false;
  restartBtn.style.display = "none";
  restartBtn.classList.remove("show-pop");
  gameLoop();
}

// --- מאזינים לכפתורים ---
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetGame);

// --- הפעלה אוטומטית של בקבוקים, פצצות וקושי ---
setInterval(dropBottle, 1500);
setInterval(dropBomb, 5000);
setInterval(() => {
  difficultyLevel += 0.2;
  santa.speed += 0.2;
}, 5000);
