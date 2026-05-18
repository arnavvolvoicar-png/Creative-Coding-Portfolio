function setup() {
  createCanvas(400, 400);
  noLoop();
}

function draw() {
  background(240);

  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    let size = random(20, 60);

    fill(random(255), random(255), random(255), 150);
    noStroke();
    ellipse(x, y, size);
  }
}

/*started by experimenting with random shapes”
Each refresh creates a different design”
Exploring colour and placement”*/