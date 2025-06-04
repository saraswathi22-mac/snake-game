// Game DOM elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById("logo");
const score = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

// Game constants and variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Utilities
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of the snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Rendering: Draw game map, snake, food
function draw() {
  board.innerHTML = "";
  drawSnake();
  drawFood();
  updateScore();
}

function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

function drawFood() {
  if (!gameStarted) return;
  const foodEl = createGameElement("div", "food");
  setPosition(foodEl, food);
  board.appendChild(foodEl);
}

function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * gridSize) + 1,
      y: Math.floor(Math.random() * gridSize) + 1,
    };
  } while (snake.some((seg) => seg.x === newFood.x && seg.y === newFood.y));
  return newFood;
}

// Moving the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case "up":
      head.y--;
      break;
    case "down":
      head.y++;
      break;
    case "left":
      head.x--;
      break;
    case "right":
      head.x++;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    restartGameLoop();
  } else {
    snake.pop();
  }
}

function checkCollision() {
  const head = snake[0];
  const hitWall =
    head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize;

  const hitSelf = snake
    .slice(1)
    .some((seg) => seg.x === head.x && seg.y === head.y);

  if (hitWall || hitSelf) resetGame();
}

function increaseSpeed() {
  if (gameSpeedDelay > 150) gameSpeedDelay -= 5;
  else if (gameSpeedDelay > 100) gameSpeedDelay -= 3;
  else if (gameSpeedDelay > 50) gameSpeedDelay -= 2;
  else if (gameSpeedDelay > 25) gameSpeedDelay -= 1;
}

// Start game function
function startGame() {
  gameStarted = true; // Keep track of a running game
  instructionText.style.display = "none";
  logo.style.display = "none";
  restartGameLoop();
}

function restartGameLoop() {
  clearInterval(gameInterval);
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = "block";
  logo.style.display = "block";
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
  draw();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, "0");
  }
  highScoreText.style.display = "block";
}

// Input Handling
function handleKeyPress(event) {
  const newDirection = (() => {
    switch (event.key) {
      case "ArrowUp":
        return "up";
      case "ArrowDown":
        return "down";
      case "ArrowLeft":
        return "left";
      case "ArrowRight":
        return "right";
      default:
        return direction;
    }
  })();

  const opposites = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };

  if (
    (!gameStarted && (event.code === "Space" || event.key === " ")) ||
    (!gameStarted && newDirection !== direction)
  ) {
    startGame();
  } else if (newDirection !== opposites[direction]) {
    direction = newDirection;
  }
}

document.addEventListener("keydown", handleKeyPress);
