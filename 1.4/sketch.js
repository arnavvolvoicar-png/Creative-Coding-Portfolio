let items = [];
let offset = 0;
let speed = 0;
let spinning = false;
let selectedItem = "";

function setup() {
  createCanvas(600, 300);

  // skins
  let names = [
    "Common", "Common", "Common",
    "Uncommon", "Uncommon",
    "Rare",
    "Epic",
    "Legendary"
  ];

  // duplicate to make long strip
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

    // colours based on rarity
    if (rarity === "Common") fill(150);
    if (rarity === "Uncommon") fill(100, 150, 255);
    if (rarity === "Rare") fill(180, 100, 255);
    if (rarity === "Epic") fill(255, 100, 200);
    if (rarity === "Legendary") fill(255, 200, 50);

    rect(x, 100, 100, 100);

    fill(0);
    textAlign(CENTER, CENTER);
    text(rarity, x + 50, 150);
  }

  // center selection box
  resetMatrix();
  noFill();
  stroke(255);
  strokeWeight(3);
  rect(width / 2 - 50, 100, 100, 100);

  // spinning logic
  if (spinning) {
    offset += speed;
    speed *= 0.97; // slow down

    if (speed < 0.5) {
      spinning = false;

      let index = floor((offset + width / 2) / 120);
      selectedItem = items[index];
    }
  }

  // result text
  fill(255);
  noStroke();
  textSize(20);
  text("Click to open case", width / 2, 40);

  if (!spinning && selectedItem !== "") {
    text("You got: " + selectedItem, width / 2, 260);
  }
}

function mousePressed() {
  if (!spinning) {
    speed = random(20, 30);
    spinning = true;
    selectedItem = "";
  }
}