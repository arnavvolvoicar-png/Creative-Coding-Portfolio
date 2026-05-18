let angle = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(10, 10, 30);

  translate(width / 2, height / 2);

  let count = 20;

  for (let i = 0; i < count; i++) {
    let a = angle + i * 0.3;
    let radius = map(mouseX, 0, width, 50, 150);

    let x = cos(a) * radius;
    let y = sin(a) * radius;

    fill(255, 150 + i * 5, 200, 150);
    noStroke();
    ellipse(x, y, 20 + sin(angle + i) * 10);
  }

  angle += 0.02;
}

/* Developed the idea into an animated generative pattern
The design reacts to the mouse and evolves over time
Explored movement, layering, and more complex visuals*/