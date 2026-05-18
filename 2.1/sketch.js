function setup() {
  createCanvas(600, 400);
  noLoop();
}

function draw() {
  background(20);

  for (let x = 0; x < width; x += 70) {
    let h = random(120, 300);
    let type = floor(random(3));

    // building colours
    fill(random(50, 150), random(50, 150), random(100, 200));
    rect(x, height - h, 60, h);

    // roof variations
    if (type === 1) {
      triangle(x, height - h, x + 60, height - h, x + 30, height - h - 30);
    } else if (type === 2) {
      rect(x + 15, height - h - 20, 30, 20);
    }

    // windows
    fill(255, 220, 100);
    for (let y = height - h + 10; y < height - 20; y += 20) {
      for (let wx = x + 10; wx < x + 50; wx += 20) {
        rect(wx, y, 10, 10);
      }
    }
  }
}