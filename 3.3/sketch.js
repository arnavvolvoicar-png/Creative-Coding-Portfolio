let engine, world, mouseConstraint;
let statics = [];
let dynObjs  = [];   // { type, bodies, constraints, color }
let impactCount = 0;
let flashTimer  = 0;

// For dragging
let mConstraint = null;
let dragBody    = null;

function setup() {
  createCanvas(740, 520);
  textFont('monospace');

  engine = Matter.Engine.create({ gravity: { y: 1.4 } });
  world  = engine.world;

  buildEnvironment();
  spawnBarbell(460, 290);   // resting on rack

  // Listen for big collisions
  Matter.Events.on(engine, 'collisionStart', (e) => {
    for (let pair of e.pairs) {
      if ((pair.collision.depth || 0) > 3) {
        impactCount++;
        flashTimer = 8;
      }
    }
  });
}

// Environment 
function buildEnvironment() {
  statics = [];

  let add = (b) => { statics.push(b); Matter.Composite.add(world, b); };

  // boundaries
  add(Matter.Bodies.rectangle(370, 530, 740, 20, { isStatic: true }));
  add(Matter.Bodies.rectangle(-10, 260, 22, 520, { isStatic: true }));
  add(Matter.Bodies.rectangle(750, 260, 22, 520, { isStatic: true }));

  // Power rack
  const rx = 460;
  add(Matter.Bodies.rectangle(rx - 65, 360, 10, 280, { isStatic: true }));
  add(Matter.Bodies.rectangle(rx + 65, 360, 10, 280, { isStatic: true }));
  add(Matter.Bodies.rectangle(rx, 222, 130, 8,  { isStatic: true })); // top bar
  add(Matter.Bodies.rectangle(rx, 300, 130, 8,  { isStatic: true })); // j-hook bar
  add(Matter.Bodies.rectangle(rx - 55, 360, 40, 7, { isStatic: true })); // safety L
  add(Matter.Bodies.rectangle(rx + 55, 360, 40, 7, { isStatic: true })); // safety R
  add(Matter.Bodies.rectangle(rx, 498, 140, 12, { isStatic: true })); // base

  // Dumbbell rack (left)
  add(Matter.Bodies.rectangle(120, 460, 180, 10, { isStatic: true }));
  add(Matter.Bodies.rectangle(120, 430, 180, 8,  { isStatic: true }));
  add(Matter.Bodies.rectangle(42,  470, 10, 80,  { isStatic: true }));
  add(Matter.Bodies.rectangle(198, 470, 10, 80,  { isStatic: true }));

  // Plyo boxes
  add(Matter.Bodies.rectangle(290, 470, 60, 60, { isStatic: true }));
  add(Matter.Bodies.rectangle(245, 450, 40, 60, { isStatic: true }));

  // Cable tower (right)
  add(Matter.Bodies.rectangle(700, 360, 26, 280, { isStatic: true }));
  add(Matter.Bodies.circle(700, 224, 14, { isStatic: true }));
}

// Equipment spawn functions

function spawnBarbell(x, y) {
  let col = random([color(200,40,20), color(20,80,200), color(20,160,30), color(200,170,0)]);
  let bar = Matter.Bodies.rectangle(x, y, 200, 10, { density:0.004, restitution:0.2, friction:0.5 });
  let pL  = Matter.Bodies.circle(x - 95, y, 22, { density:0.006, restitution:0.3 });
  let pR  = Matter.Bodies.circle(x + 95, y, 22, { density:0.006, restitution:0.3 });
  Matter.Composite.add(world, [bar, pL, pR]);
  dynObjs.push({ type:'barbell', bodies:[bar,pL,pR], color:col });
}

function spawnDumbbell(x, y) {
  x = x || random(80, 660);
  y = y || 30;
  let col = color(random(50,220), random(50,220), random(50,220));
  let bar = Matter.Bodies.rectangle(x, y, 65, 7, { density:0.002, restitution:0.3, friction:0.5 });
  let hL  = Matter.Bodies.circle(x - 34, y, 13, { density:0.007, restitution:0.35 });
  let hR  = Matter.Bodies.circle(x + 34, y, 13, { density:0.007, restitution:0.35 });
  let cL  = Matter.Constraint.create({ bodyA:bar, pointA:{x:-30,y:0}, bodyB:hL, stiffness:1, length:2 });
  let cR  = Matter.Constraint.create({ bodyA:bar, pointA:{x:30,y:0},  bodyB:hR, stiffness:1, length:2 });
  Matter.Composite.add(world, [bar, hL, hR, cL, cR]);
  dynObjs.push({ type:'dumbbell', bodies:[bar,hL,hR], constraints:[cL,cR], color:col });
}

function spawnKettlebell(x, y) {
  x = x || random(80, 660);
  y = y || 30;
  let ball   = Matter.Bodies.circle(x, y + 10, 22, { density:0.008, restitution:0.2, friction:0.7 });
  let handle = Matter.Bodies.rectangle(x, y - 14, 30, 7, { density:0.001, restitution:0.2 });
  let cL = Matter.Constraint.create({ bodyA:ball, pointA:{x:-11,y:-19}, bodyB:handle, pointB:{x:-13,y:0}, stiffness:1, length:1 });
  let cR = Matter.Constraint.create({ bodyA:ball, pointA:{x:11,y:-19},  bodyB:handle, pointB:{x:13,y:0},  stiffness:1, length:1 });
  Matter.Composite.add(world, [ball, handle, cL, cR]);
  dynObjs.push({ type:'kettlebell', bodies:[ball,handle], constraints:[cL,cR] });
}

function spawnMedBall(x) {
  x = x || random(80, 660);
  let r = 18 + random(12);
  let b = Matter.Bodies.circle(x, 30, r, { density:0.012, restitution:0.55, friction:0.8 });
  Matter.Composite.add(world, b);
  dynObjs.push({ type:'medball', bodies:[b] });
}

function plateBomb() {
  let cx = random(120, 620);
  for (let i = 0; i < 12; i++) {
    let angle = (i / 12) * TWO_PI;
    let r = 30 + random(50);
    let plate = Matter.Bodies.circle(
      cx + cos(angle)*r, 50 + random(60),
      10 + random(16),
      { density:0.005, restitution:0.4, friction:0.3 }
    );
    Matter.Body.setVelocity(plate, {
      x: random(-8, 8),
      y: random(-10, -3)
    });
    Matter.Composite.add(world, plate);
    dynObjs.push({ type:'plate', bodies:[plate] });
  }
}

function resetGym() {
  Matter.Composite.clear(world, false);
  statics  = [];
  dynObjs  = [];
  impactCount = 0;
  buildEnvironment();
  spawnBarbell(460, 290);
}

// Drag logic

function getBodyAtPoint(x, y) {
  let all = Matter.Composite.allBodies(world);
  for (let b of all) {
    if (!b.isStatic && Matter.Bounds.contains(b.bounds, {x,y})) {
      if (Matter.Vertices.contains(b.vertices, {x,y})) return b;
    }
  }
  return null;
}

function mousePressed() {
  let b = getBodyAtPoint(mouseX, mouseY);
  if (b) {
    dragBody = b;
    mConstraint = Matter.Constraint.create({
      pointA: { x: mouseX, y: mouseY },
      bodyB:  b,
      pointB: { x: mouseX - b.position.x, y: mouseY - b.position.y },
      stiffness: 0.15,
      length: 0,
      render: { visible: false }
    });
    Matter.Composite.add(world, mConstraint);
  } else {
    // Drop a plate
    let plate = Matter.Bodies.circle(mouseX, mouseY, 18, { density:0.005, restitution:0.4 });
    Matter.Composite.add(world, plate);
    dynObjs.push({ type:'plate', bodies:[plate] });
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
    dragBody    = null;
  }
}

// Draw

function draw() {
  Matter.Engine.update(engine, 1000 / 60);

  // Flash on impact
  if (flashTimer > 0) {
    background(60, 20, 10);
    flashTimer--;
  } else {
    background(18, 18, 22);
  }

  // Draw drag line
  if (mConstraint && dragBody) {
    stroke(255, 80, 0, 160);
    strokeWeight(1.5);
    line(mConstraint.pointA.x, mConstraint.pointA.y,
         dragBody.position.x,  dragBody.position.y);
  }

  // Static bodies
  fill(45); stroke(60); strokeWeight(1);
  for (let s of statics) drawBody(s, null);

  // Dynamic objects
  for (let obj of dynObjs) {
    if (obj.type === 'barbell') {
      fill(190); stroke(120); strokeWeight(1);
      drawBody(obj.bodies[0], null); // bar
      fill(obj.color); stroke(red(obj.color)*0.6, green(obj.color)*0.6, blue(obj.color)*0.6);
      drawBody(obj.bodies[1], null);
      drawBody(obj.bodies[2], null);
    } else if (obj.type === 'dumbbell') {
      fill(150); stroke(100); strokeWeight(1);
      drawBody(obj.bodies[0], null);
      fill(obj.color);
      drawBody(obj.bodies[1], null);
      drawBody(obj.bodies[2], null);
    } else if (obj.type === 'kettlebell') {
      fill(30); stroke(80); strokeWeight(1.5);
      drawBody(obj.bodies[0], null);
      fill(50); stroke(80);
      drawBody(obj.bodies[1], null);
    } else if (obj.type === 'medball') {
      fill(20); stroke(70); strokeWeight(2);
      drawBody(obj.bodies[0], null);
    } else if (obj.type === 'plate') {
      fill(220, 60, 0); stroke(140, 30, 0); strokeWeight(1);
      drawBody(obj.bodies[0], null);
    }
  }

  // HUD
  noStroke();
  fill(0, 0, 0, 140);
  rect(0, 0, width, 44);
  fill(255, 100, 0);
  textSize(14);
  text('GYM SIM MK2', 10, 18);
  fill(180);
  textSize(11);
  text(`bodies: ${Matter.Composite.allBodies(world).filter(b=>!b.isStatic).length}   impacts: ${impactCount}`, 10, 36);
  fill(120);
  text('CLICK=plate  D=dumbbell  K=kettlebell  B=barbell  M=medball  X=bomb  R=reset', 160, 20);
  text('DRAG objects with mouse', 160, 36);
}

function drawBody(body) {
  let verts = body.vertices;
  push();
  beginShape();
  for (let v of verts) vertex(v.x, v.y);
  endShape(CLOSE);
  pop();
}

function keyPressed() {
  if (key === 'b' || key === 'B') spawnBarbell(random(100,620), 30);
  if (key === 'd' || key === 'D') spawnDumbbell();
  if (key === 'k' || key === 'K') spawnKettlebell();
  if (key === 'm' || key === 'M') spawnMedBall();
  if (key === 'x' || key === 'X') plateBomb();
  if (key === 'r' || key === 'R') resetGym();
}