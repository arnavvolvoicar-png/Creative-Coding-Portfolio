# Experiment 3

In the base version of this physics experiment, I focused on building a very simple gym scene using Matter.js: a power rack made from static rectangles, a ground and side walls, and a single barbell that can fall and collide with the environment. I also added the ability to spawn weight plates by clicking, which drop from the top and interact with the bar and rack. Visually, this version is quite minimal, but it let me understand how to create bodies, add them to the world, and render them using p5.js by looping through their vertices. The reset logic, basic UI text, and simple drawing of rectangles and circles are consistent with how I worked in Experiments 1 and 2. This version was mainly about getting comfortable with the physics engine and treating it like an extension of my usual p5.js sketches, but with gravity and collisions.

[Base Version](/3.1/index.hhtml)

In this version, I expanded the scene into a more complete “gym sim.” I built a richer static environment with a detailed power rack, dumbbell rack, floor, and a plyo box, all made from static Matter.js rectangles. I then added multiple types of dynamic equipment: barbells, dumbbells, kettlebells, and loose plates. Each piece of equipment is made from several bodies grouped together and stored in an equipment array with a type label, so I can draw them differently depending on what they are. I also added a simple collision counter and a flash effect when strong impacts occur, which makes the physics feel more alive. The key controls for spawning different equipment and resetting the gym follow the same style as my earlier experiments. While the more advanced Matter.js patterns (constraints, multi‑body setups) were AI‑influenced.

[Updated](/3.2/index.html)

In the final version, the gym turns into a fully interactive physics playground. I kept the detailed environment but added more elements like cable towers and extra boxes to make the space feel busier. I introduced more equipment types, including medicine balls and a “plate bomb” that explodes plates outward in a circle with initial velocities, creating chaotic but satisfying collisions. A big addition in this version is mouse‑based dragging: I use hit detection to find a body under the cursor, then attach a temporary constraint so the user can grab and throw objects around the gym. I also refined the impact flash system and added a HUD that shows the number of dynamic bodies and collisions, plus clear key prompts for spawning each item.

[Final Version](/3.3/index.html)
