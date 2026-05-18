let markerX;

function setup() {
  createCanvas(600, 300);
  markerX = width / 2;
  textAlign(CENTER, CENTER);
}

function draw() {
  background(30);

  // Mid line
  stroke(255);
  line(width / 2, 0, width / 2, height);

  // Marker
  noStroke();
  fill(255);
  ellipse(markerX, height / 2, 20, 20);

  // Win check
  if (markerX < 0) {
    textSize(32);
    text("Player Right Wins!", width / 2, height / 2);
    noLoop();
  } else if (markerX > width) {
    textSize(32);
    text("Player Left Wins!", width / 2, height / 2);
    noLoop();
  }

  textSize(14);
  text("Press SPACE strategically!", width / 2, 20);
}

function keyPressed() {
  if (key === ' ') {
    if (markerX < width / 2) {
      markerX += 15; // push right
    } else {
      markerX -= 15; // push left
    }
  }
}