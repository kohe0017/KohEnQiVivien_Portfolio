/* DM3014 Interactive Devices
Koh En Qi, Vivien "money, money, money" This sketch referenced https://editor.p5js.org/fauthereea/full/Nce8NkMVV to create a sketch that employs teachable machine to detect when a wallet is in view of the webcam. When the wallet is detected, dollar signs, with shades of pink, yellow and oranges, rain down from the top to signify an abundance of money. 
 */


let classifier;
const imageModelURL = "https://teachablemachine.withgoogle.com/models/1Kz91ruIs/";

let video;
let flippedVideo;
let label = ""; 
let words = [];
let wordFall = setInterval(makeWord, 100);
let letters = ['$']; // to signify money :p


function preload() {
  classifier = ml5.imageClassifier(imageModelURL + "model.json");
}

function setup() {
  createCanvas(320, 260);
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  flippedVideo = ml5.flipImage(video);
  classifyVideo();

  
}

function draw() {
  background(0);

  image(flippedVideo, 0, 0);

  if (label == "no wallet") {
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
}
if (label == "wallet") {
  fill("#f7eb10ff");
  textSize(30);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
  for (var i = words.length - 1; i >= 0; i--) {
    words[i].display();
    words[i].move();

    if (words[i].isOffScreen()) {
      words.splice(i, 1);
    }
}
}
}

function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  label = results[0].label; 

  classifyVideo(); 
}

function makeWord() {
  words.push(new Word());
  console.log(words.length);
}

class Word {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.speed = 1;
    this.l = random(letters);
    this.color = color(255,random(255),random(255));
  }

  move() {
    this.y += this.speed;
  }
  display() {

    fill(this.color);
    text(this.l, this.x, this.y);
  }

  isOffScreen() {
    if (this.y > height) {
      return true
    }
  }
}
