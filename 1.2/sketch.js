function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(20);

  let spacing = map(mouseX, 0, width, 20, 80);

  for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing) {
      
      let size = map(mouseY, 0, height, 10, spacing);
      
      fill(100, 200, 255);
      noStroke();
      rect(x, y, size, size);
    }
  }
}

/* moved from random to a grid-based structure
The user can control spacing and size with the mouse
This makes the design interactive and dynamic*/