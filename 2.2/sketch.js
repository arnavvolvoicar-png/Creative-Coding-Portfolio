let buildings = [];

function setup() {
  createCanvas(700, 450);

  for (let x = 0; x < width; x += 90) {
    let h = random(150, 280);
    let type = floor(random(2));

    buildings.push({
      x: x,
      h: h,
      type: type
    });
  }

  noLoop(); 
}

function draw() {
  background(30, 30, 60); 

  // sun
  fill(255, 180, 80);
  noStroke();
  ellipse(500, 120, 60);

  // ground
  fill(20);
  rect(0, height - 60, width, 60);

  // buildings
  for (let b of buildings) {
    fill(60, 80, random(120, 180));
    rect(b.x, height - b.h, 70, b.h);

    //2 building types
    if (b.type === 1) {
      triangle(
        b.x,
        height - b.h,
        b.x + 70,
        height - b.h,
        b.x + 35,
        height - b.h - 30
      );
    }

    // windows
    fill(255, 220, 100);

    for (let y = height - b.h + 15; y < height - 20; y += 30) {
      rect(b.x + 15, y, 10, 10); // only one column
    }
  }

  /*add more building types
  improve sky (gradient / night mode)
  fix window layout (more columns)
  add interaction (mouse lighting or time change)*/
}