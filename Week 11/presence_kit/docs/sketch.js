/* DM3014 Interactive Devices
Koh En Qi, Vivien. "campfire" This project depicts an abstract campfire that glows brighter when the viewer is closer, turning the scene from a dark empty night to one warmed and lit up by the campfire. I edited the lines, as well as added more ellipses and changed all the colours appropriately to resemble a campfire.
*/

const FAR_CM = 200; // treat anything further than this as "nobody"
const DAY = "#00216fff"; // background when nobody is near
const NIGHT = "#fbc618ff"; // background when someone is right there
const LAMP = [254, 84, 5]; // dark orange for fire

// lines that sound more like someone inviting the viewer towards a campfire
const LINES = [
  "Are you cold? Come closer.",
  "If the fire is dying, let me know.",
  "Warm, right? It's warmer with you here.",
  "Pretty, right? A welcome heat for a cold day.",
];

let smooth = FAR_CM; 
let shown = 0; 
let line = "";

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  sensor.connect(firebaseConfig, DATA_PATH);

  sensor.on("near", () => {
    line = random(LINES);
  });

  sensor.on("far", () => {
    console.log("they left");
  });
}

function draw() {
  const target = sensor.distance > 0 ? min(sensor.distance, FAR_CM) : FAR_CM;
  smooth = lerp(smooth, target, 0.08);

  const closeness = constrain(map(smooth, FAR_CM, 10, 0, 1), 0, 1);

  background(lerpColor(color(DAY), color(NIGHT), closeness));

  noStroke();
  for (let i = 6; i > 0; i--) {
    fill(LAMP[0], LAMP[1], LAMP[2], 40 * closeness);
    circle(width / 2, height / 2, i * 90 * closeness);
    circle(2 * width / 3, 2 * height / 3, i * 45 * closeness);
    circle(width / 3, 2 * height / 3, i * 45 * closeness); // added two smaller circles to mimic the stereotpical shape of a campfire
  }

  shown = lerp(shown, sensor.near ? 1 : 0, 0.06);
  fill(255, 255 * shown);
  textFont("Karla");
  textSize(min(width, height) * 0.05);
  text(line, width / 2, height / 2 + min(width, height) * 0.28);

  fill(closeness > 0.5 ? 200 : 60);
  textFont("JetBrains Mono");
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text(
    sensor.distance < 0 ? "— cm" : nf(sensor.distance, 1, 1) + " cm",
    16,
    height - 16
  );
  textAlign(CENTER, CENTER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
