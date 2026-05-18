// Matter.js
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;

let engine, world;
let ground, wallL, wallR;
let objects = [];
let rackParts = [];

function setup() {
  createCanvas(700, 500);

  // Setup Matter engine
  engine = Engine.create();
  world = engine.world;

  // Ground and walls
  ground = Bodies.rectangle(350, 510, 700, 20, { isStatic: true });
  wallL = Bodies.rectangle(-10, 250, 20, 500, { isStatic: true });
  wallR = Bodies.rectangle(710, 250, 20, 500, { isStatic: true });
  Composite.add(world, [ground, wallL, wallR]);

  buildRack();
  spawnBarbell(350, 340);
}

function buildRack() {
  // Simple power rack from static rectangles
  let base = Bodies.rectangle(350, 468, 160, 14, { isStatic: true });
  let postL = Bodies.rectangle(280, 390, 12, 170, { isStatic: true });
  let postR = Bodies.rectangle(420, 390, 12, 170, { isStatic: true });
  let shelf = Bodies.rectangle(350, 307, 160, 10, { isStatic: true });
  rackParts = [base, postL, postR, shelf];
  Composite.add(world, rackParts);
}

function spawnBarbell(x, y) {
  let bar = Bodies.rectangle(x, y, 180, 10, { restitution: 0.3, friction: 0.5 });
  let pL = Bodies.circle(x - 85, y, 20, { restitution: 0.3 });
  let pR = Bodies.circle(x + 85, y, 20, { restitution: 0.3 });
  Composite.add(world, [bar, pL, pR]);
  objects.push({ type: 'bar', bodies: [bar, pL, pR] });
}

function spawnPlate(x) {
  let plate = Bodies.circle(x, 20, 20, { restitution: 0.4, friction: 0.4 });
  Composite.add(world, plate);
  objects.push({ type: 'plate', bodies: [plate] });
}

function draw() {
  Engine.update(engine, 1000 / 60);
  background(25);

  // Floor label
  fill(60);
  noStroke();
  rect(0, 478, width, 22);

  // Draw rack
  fill(80);
  noStroke();
  for (let r of rackParts) drawBody(r);

  // Draw objects
  for (let obj of objects) {
    if (obj.type === 'bar') {
      fill(180);
      noStroke();
      drawBody(obj.bodies[0]); // bar
      fill(220, 60, 30);
      drawBody(obj.bodies[1]); // left plate
      drawBody(obj.bodies[2]); // right plate
    } else if (obj.type === 'plate') {
      fill(255, 120, 0);
      drawBody(obj.bodies[0]);
    }
  }

  // UI
  fill(255);
  noStroke();
  textSize(12);
  textFont('monospace');
  text('CLICK = drop plate  |  [B] = barbell  |  [R] = reset', 12, 20);
  text('bodies: ' + Composite.allBodies(world).length, 12, 36);
}

// Draw a Matter.js body as a polygon
function drawBody(body) {
  let verts = body.vertices;
  if (verts.length === 1) {
    // Circle
    circle(body.position.x, body.position.y, body.circleRadius * 2);
  } else {
    beginShape();
    for (let v of verts) vertex(v.x, v.y);
    endShape(CLOSE);
  }
}

function mousePressed() {
  spawnPlate(mouseX);
}

function keyPressed() {
  if (key === 'b' || key === 'B') {
    spawnBarbell(random(120, 580), 30);
  }
  if (key === 'r' || key === 'R') {
    Composite.clear(world, false);
    objects = [];
    rackParts = [];
    Composite.add(world, [ground, wallL, wallR]);
    buildRack();
    spawnBarbell(350, 340);
  }
}
