let markerX;
let speed = 0;
let gameOver = false;
let winner = "";

function setup() {
  createCanvas(800, 400);
  markerX = width / 2;
  textAlign(CENTER, CENTER);
}

function draw() {
  background(30);

  // Zones
  noStroke();
  fill(50, 100, 255, 80); // Player 1 zone (left)
  rect(0, 0, width / 2, height);

  fill(255, 100, 100, 80); // Player 2 zone (right)
  rect(width / 2, 0, width / 2, height);

  // Center line
  stroke(255);
  line(width / 2, 0, width / 2, height);

  // Marker
  noStroke();
  fill(255);
  ellipse(markerX, height / 2, 30, 30);

  // Movement
  if (!gameOver) {
    markerX += speed;
    speed *= 0.95; // friction
  }

  // Win conditions
  if (markerX < 20) {
    gameOver = true;
    winner = "Player 2 Wins!";
  } else if (markerX > width - 20) {
    gameOver = true;
    winner = "Player 1 Wins!";
  }

  // UI text
  fill(255);
  textSize(16);
  text("Press SPACE at the right moment!", width / 2, 30);

  if (gameOver) {
    textSize(40);
    text(winner, width / 2, height / 2);
    textSize(20);
    text("Press R to restart", width / 2, height / 2 + 50);
  }
}

function keyPressed() {
  if (key === ' ') {
    if (!gameOver) {
      // Determine which side marker is on
      if (markerX < width / 2) {
        // Left side → Player 1 advantage
        speed += 5;
      } else {
        // Right side → Player 2 advantage
        speed -= 5;
      }
    }
  }

  if (key === 'r' || key === 'R') {
    restartGame();
  }
}

function restartGame() {
  markerX = width / 2;
  speed = 0;
  gameOver = false;
  winner = "";
}