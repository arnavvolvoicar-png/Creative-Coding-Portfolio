let engine, world;
let statics = [];
let equipment = [];   // stores each object with a type and body list
let mConstraint = null;  // for mouse dragging
let impactCount = 0;
let flashTimer  = 0;

function setup() {
  createCanvas(740, 520);
  textFont('monospace');

  // Create the physics engine
  engine = Matter.Engine.create();
  engine.gravity.y = 1.4;
  world = engine.world;

  buildEnvironment();
  spawnBarbell(450, 295);  // starts resting on the rack

  // Detect big collisions and flash the screen
  Matter.Events.on(engine, 'collisionStart', function(event) {
    let pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      let depth = pairs[i].collision.depth;
      if (depth > 3) {
        impactCount++;
        flashTimer = 8;
      }
    }
  });
}

// Build the static gym scene
function buildEnvironment() {
  statics = [];

  // Floor and walls
  addStatic(Matter.Bodies.rectangle(370, 530, 740, 22, { isStatic: true }));
  addStatic(Matter.Bodies.rectangle(-10, 260, 22, 520, { isStatic: true }));
  addStatic(Matter.Bodies.rectangle(750, 260, 22, 520, { isStatic: true }));

  // Power rack - two uprights
  addStatic(Matter.Bodies.rectangle(385, 360, 12, 280, { isStatic: true }));
  addStatic(Matter.Bodies.rectangle(515, 360, 12, 280, { isStatic: true }));
  // Top crossbar
  addStatic(Matter.Bodies.rectangle(450, 225, 130, 10, { isStatic: true }));
  // J-hooks where barbell rests
  addStatic(Matter.Bodies.rectangle(391, 302, 26, 8, { isStatic: true }));
  addStatic(Matter.Bodies.rectangle(509, 302, 26, 8, { isStatic: true }));
  // Safety bars
  addStatic(Matter.Bodies.rectangle(400, 360, 38, 7, { isStatic: true }));
  addStatic(Matter.Bodies.rectangle(500, 360, 38, 7, { isStatic: true }));
  // Base
  addStatic(Matter.Bodies.rectangle(450, 500, 150, 12, { isStatic: true }));

  // Dumbbell rack on the left
  addStatic(Matter.Bodies.rectangle(110, 466, 180, 10, { isStatic: true }));
  addStatic(Matter.Bodies.rectangle(110, 438, 180, 8,  { isStatic: true }));
  addStatic(Matter.Bodies.rectangle(30,  474, 10, 76,  { isStatic: true }));
  addStatic(Matter.Bodies.rectangle(190, 474, 10, 76,  { isStatic: true }));

  // A plyo box on the right side
  addStatic(Matter.Bodies.rectangle(630, 466, 80, 80, { isStatic: true }));
}

function addStatic(body) {
  statics.push(body);
  Matter.Composite.add(world, body);
}

// Spawn a barbell (bar + two plate circles)
function spawnBarbell(x, y) {
  let bar = Matter.Bodies.rectangle(x, y, 200, 10, {
    density: 0.004,
    restitution: 0.2,
    friction: 0.5
  });
  let plateL = Matter.Bodies.circle(x - 95, y, 22, {
    density: 0.006,
    restitution: 0.3,
    friction: 0.4
  });
  let plateR = Matter.Bodies.circle(x + 95, y, 22, {
    density: 0.006,
    restitution: 0.3,
    friction: 0.4
  });
  Matter.Composite.add(world, [bar, plateL, plateR]);
  // Pick a random plate colour
  let cols = ['#cc2200', '#0044cc', '#228822', '#cc9900'];
  let col = cols[floor(random(cols.length))];
  equipment.push({ type: 'barbell', bodies: [bar, plateL, plateR], col: col });
}

// Spawn a dumbbell using Constraints to join the heads
function spawnDumbbell(x, y) {
  let bar = Matter.Bodies.rectangle(x, y, 65, 7, {
    density: 0.002,
    restitution: 0.3
  });
  let headL = Matter.Bodies.circle(x - 34, y, 13, {
    density: 0.007,
    restitution: 0.35
  });
  let headR = Matter.Bodies.circle(x + 34, y, 13, {
    density: 0.007,
    restitution: 0.35
  });
  // Constraints lock the heads to the bar ends
  let cL = Matter.Constraint.create({
    bodyA: bar,   pointA: { x: -30, y: 0 },
    bodyB: headL, pointB: { x: 0,   y: 0 },
    stiffness: 1, length: 2
  });
  let cR = Matter.Constraint.create({
    bodyA: bar,   pointA: { x: 30, y: 0 },
    bodyB: headR, pointB: { x: 0,  y: 0 },
    stiffness: 1, length: 2
  });
  Matter.Composite.add(world, [bar, headL, headR, cL, cR]);
  let col = color(random(60, 220), random(60, 220), random(60, 220));
  equipment.push({ type: 'dumbbell', bodies: [bar, headL, headR], col: col });
}

// Spawn a kettlebell using Constraints for the handle
function spawnKettlebell(x, y) {
  let ball = Matter.Bodies.circle(x, y + 12, 22, {
    density: 0.009,
    restitution: 0.2,
    friction: 0.7
  });
  let handle = Matter.Bodies.rectangle(x, y - 12, 28, 7, {
    density: 0.001,
    restitution: 0.2
  });
  let cL = Matter.Constraint.create({
    bodyA: ball,   pointA: { x: -11, y: -18 },
    bodyB: handle, pointB: { x: -12, y:   0 },
    stiffness: 1, length: 1
  });
  let cR = Matter.Constraint.create({
    bodyA: ball,   pointA: { x: 11, y: -18 },
    bodyB: handle, pointB: { x: 12, y:   0 },
    stiffness: 1, length: 1
  });
  Matter.Composite.add(world, [ball, handle, cL, cR]);
  equipment.push({ type: 'kettlebell', bodies: [ball, handle] });
}

// Reset everything
function resetGym() {
  Matter.Composite.clear(world, false);
  statics   = [];
  equipment = [];
  impactCount = 0;
  buildEnvironment();
  spawnBarbell(450, 295);
}

// Mouse drag
function getBodyAt(x, y) {
  let all = Matter.Composite.allBodies(world);
  for (let b of all) {
    if (b.isStatic) continue;
    if (Matter.Bounds.contains(b.bounds, { x, y })) {
      if (Matter.Vertices.contains(b.vertices, { x, y })) return b;
    }
  }
  return null;
}

function mousePressed() {
  let hit = getBodyAt(mouseX, mouseY);
  if (hit) {
    // Start dragging
    mConstraint = Matter.Constraint.create({
      pointA: { x: mouseX, y: mouseY },
      bodyB:  hit,
      pointB: { x: mouseX - hit.position.x, y: mouseY - hit.position.y },
      stiffness: 0.15,
      length: 0
    });
    Matter.Composite.add(world, mConstraint);
  } else {
    // Click on empty space = drop a plate
    let plate = Matter.Bodies.circle(mouseX, mouseY, 18, {
      density: 0.005,
      restitution: 0.4,
      friction: 0.3
    });
    Matter.Composite.add(world, plate);
    equipment.push({ type: 'plate', bodies: [plate] });
  }
}

function mouseDragged() {
  if (mConstraint) {
    mConstraint.pointA = { x: mouseX, y: mouseY };
  }
}

function mouseReleased() {
  if (mConstraint) {
    Matter.Composite.remove(world, mConstraint);
    mConstraint = null;
  }
}

// Key controls
function keyPressed() {
  if (key === 'b' || key === 'B') spawnBarbell(random(100, 640), 30);
  if (key === 'd' || key === 'D') spawnDumbbell(random(80, 660), 30);
  if (key === 'k' || key === 'K') spawnKettlebell(random(80, 660), 30);
  if (key === 'r' || key === 'R') resetGym();
}

// Drawing helpers
function drawBody(body) {
  beginShape();
  for (let v of body.vertices) vertex(v.x, v.y);
  endShape(CLOSE);
}

// Main draw loop 
function draw() {
  Matter.Engine.update(engine, 1000 / 60);

  // Flash red on big impact, otherwise dark background
  if (flashTimer > 0) {
    background(60, 15, 10);
    flashTimer--;
  } else {
    background(20, 20, 26);
  }

  // Draw rubber floor strip
  noStroke();
  fill(30, 32, 36);
  rect(10, height - 28, width - 20, 16, 3);

  // Draw static environment
  fill(50, 52, 60);
  stroke(70, 72, 82);
  strokeWeight(1);
  for (let s of statics) drawBody(s);

  // Highlight J-hooks in orange
  fill(180, 70, 0);
  noStroke();
  rect(378, 298, 26, 8);
  rect(496, 298, 26, 8);

  // Draw each piece of equipment
  for (let eq of equipment) {

    if (eq.type === 'barbell') {
      // Steel bar
      fill(195, 200, 210);
      stroke(130);
      strokeWeight(1);
      drawBody(eq.bodies[0]);
      // Coloured plates
      fill(eq.col);
      stroke(80);
      strokeWeight(1.5);
      drawBody(eq.bodies[1]);
      drawBody(eq.bodies[2]);
    }

    else if (eq.type === 'dumbbell') {
      // Grey bar
      fill(160);
      stroke(100);
      strokeWeight(1);
      drawBody(eq.bodies[0]);
      // Coloured heads
      fill(eq.col);
      stroke(80);
      strokeWeight(1.5);
      drawBody(eq.bodies[1]);
      drawBody(eq.bodies[2]);
    }

    else if (eq.type === 'kettlebell') {
      // Dark iron ball
      fill(30);
      stroke(90);
      strokeWeight(2);
      drawBody(eq.bodies[0]);
      // Handle
      fill(50);
      stroke(80);
      strokeWeight(1);
      drawBody(eq.bodies[1]);
    }

    else if (eq.type === 'plate') {
      fill(210, 55, 10);
      stroke(130, 30, 0);
      strokeWeight(1.5);
      drawBody(eq.bodies[0]);
      // Small centre hole
      fill(20);
      noStroke();
      circle(eq.bodies[0].position.x, eq.bodies[0].position.y, 7);
    }
  }

  // Draw the drag line when pulling an object
  if (mConstraint) {
    stroke(255, 100, 0, 180);
    strokeWeight(1.5);
    let b = mConstraint.bodyB;
    line(mConstraint.pointA.x, mConstraint.pointA.y,
         b.position.x, b.position.y);
  }

  // HUD overlay
  noStroke();
  fill(0, 0, 0, 160);
  rect(0, 0, width, 46);

  fill(255, 80, 0);
  textSize(16);
  text('GYM SIM  MK2', 10, 22);

  fill(170);
  textSize(10);
  let dynCount = Matter.Composite.allBodies(world).filter(b => !b.isStatic).length;
  text('bodies: ' + dynCount + '   impacts: ' + impactCount, 10, 38);

  fill(100);
  textSize(10);
  text('CLICK = drop plate   B = barbell   D = dumbbell   K = kettlebell   R = reset   DRAG = move objects', 160, 24);
}