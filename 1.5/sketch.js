let items = [];
let offset = 0;
let targetOffset = 0;
let speed = 0;
let spinning = false;
let reveal = false;
let selectedItem = "";

function setup() {
  createCanvas(600, 300);

  let names = [
    "Common", "Common", "Common",
    "Uncommon", "Uncommon",
    "Rare",
    "Epic",
    "Legendary"
  ];

  for (let i = 0; i < 100; i++) {
    items.push(random(names));
  }
}

function draw() {
  background(20);

  translate(-offset, 0);

  // draw items
  for (let i = 0; i < items.length; i++) {
    let x = i * 120;
    let rarity = items[i];

    // MASK MODE: hide colours while spinning
    if (!reveal) {
      fill(80); // neutral grey
    } else {
      // REAL COLOURS after reveal
      if (rarity === "Common") fill(150);
      if (rarity === "Uncommon") fill(100, 150, 255);
      if (rarity === "Rare") fill(180, 100, 255);
      if (rarity === "Epic") fill(255, 100, 200);
      if (rarity === "Legendary") fill(255, 200, 50);
    }

    rect(x, 100, 100, 100);

    // Only show text AFTER reveal
    if (reveal) {
      fill(0);
      textAlign(CENTER, CENTER);
      text(rarity, x + 50, 150);
    }
  }

  resetMatrix();
  noFill();
  stroke(255);
  strokeWeight(3);
  rect(width / 2 - 50, 100, 100, 100);

  // spinning logic
  if (spinning) {
    offset += speed;
    speed *= 0.97;

    if (speed < 0.5) {
      offset = lerp(offset, targetOffset, 0.2);

      if (abs(offset - targetOffset) < 0.5) {
        offset = targetOffset;
        spinning = false;
        reveal = true; // NOW reveal colours + text
      }
    }
  }

  fill(255);
  noStroke();
  textSize(20);
  text("Click to open case", width / 2, 40);

  if (reveal) {
    text("You got: " + selectedItem, width / 2, 260);
  }
}

function mousePressed() {
  if (!spinning) {
    reveal = false;

    // pick winning index
    let winningIndex = floor(random(items.length));
    selectedItem = items[winningIndex];

    // calculate exact offset so winning item lands in centre
    targetOffset = winningIndex * 120 - (width / 2 - 50);

    speed = random(20, 30);
    spinning = true;
  }
}
