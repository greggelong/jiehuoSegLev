// Brightness Mirror — Segmented Only, Mirrored
let bodySegmentation;
let segmentation;
let myvideo;
let vScale;
let title;
let stamp;
let hanidx;

const hanzi = [
  "滴",
  "涌",
  "泉",
  "思",
  "汗",
  "禾",
  "文",
  "下",
  "土",
  "",
  "",
  "",
  "",
  "",
];

let options = { maskType: "background" };

function preload() {
  title = loadImage("title.png");
  stamp = loadImage("stamp.png");
  bodySegmentation = ml5.bodySegmentation("SelfieSegmentation", options);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER)

  // ORIGINAL VScale LOGIC
  if (width < height) {
    vScale = width / 30; // scale based on width
    title.resize(width*0.80, 0);
    stamp.resize(width*0.29, 0);
  } else {
    vScale = floor(height / 30); // scale based on height
    title.resize(width*0.80, 0);
    stamp.resize(width*0.29, 0);
  }

  pixelDensity(1);
  myvideo = createCapture(VIDEO);
  myvideo.size(width / vScale, height / vScale);
  myvideo.hide();

  bodySegmentation.detectStart(myvideo, gotResults);

  frameRate(5);
  textAlign(LEFT, TOP);
  angleMode(DEGREES)
}

function draw() {
  background(255);

  if (segmentation) {
    myvideo.mask(segmentation.mask);
    myvideo.loadPixels();

    // put the image segmented image behind
    /* push();
    translate(width, 0);
    scale(-1, 1);
    image(myvideo, 0, 0, width, height);
    pop(); */

    for (let y = 0; y < myvideo.height; y++) {
      for (let x = 0; x < myvideo.width; x++) {
        let index = (x + y * myvideo.width) * 4;
        let r = myvideo.pixels[index];
        let g = myvideo.pixels[index + 1];
        let b = myvideo.pixels[index + 2];

        // skip white background
        if (myvideo.pixels[index + 3] == 0) {
          hanidx = 10;
        } else {
          let bright = floor((r + g + b) / 3);
          hanidx = floor(map(bright, 0, 255, 0, hanzi.length - 1));
        }

        fill(0);
        noStroke();
        textSize(vScale);
        //text(hanzi[hanidx], x * vScale, y * vScale);
        text(hanzi[hanidx], width - x * vScale, y * vScale);
      }
    }

    image(title, width/2, title.height*0.7);
    push();
    translate(width-stamp.width*1,height-height/4)
    rotate(10)
    image(stamp,0,0)
    pop();
  }
}

function gotResults(result) {
  segmentation = result;
}

function keyPressed() {
  if (key === "s") saveCanvas("characterB", "jpg");
}
