/*
IDEAS:
- flip eyes in case of different face orientation (see distance to box)
- rotate eyes/mouth to fit better
- use facemesh to cut more face pieces
- add nose

TO FIX:
- glitchy mouth (assets/334018.jpg)
- why do I need to resize the images?
*/

console.log('ml5 version:', ml5.version);
  
let faceapi;

let imgBase;
let imgLeftEye;
let imgRightEye;
let imgMouth;

let verticesLeftEye;
let centroidLeftEye;
let radLeftEye;

let verticesRightEye;
let centroidRightEye;
let radRightEye;

let verticesMouth;
let centroidMouth;
let radMouth;

// by default all options are set to true
const detectionOptions = {
    withLandmarks: true,
    withDescriptors: false,
}

function preload() {
    let images = ["assets/301060.jpg", "assets/3555297.jpg", "assets/334018.jpg", "assets/311653.jpg"];
    shuffle(images, true);
    //images = ["assets/334018.jpg", "assets/301060.jpg", "assets/311653.jpg", "assets/3555297.jpg"]; // problem with left eye!
    //images = ["assets/334018.jpg", "assets/3555297.jpg", "assets/311653.jpg", "assets/301060.jpg"]; // probelm with mouth
    //images = ["assets/334018.jpg", "assets/3555297.jpg", "assets/301060.jpg", "assets/311653.jpg"]; // problem with right eye
    //images = ["assets/301060.jpg", "assets/301060.jpg", "assets/301060.jpg", "assets/301060.jpg"];
    
    imgBase = loadImage(images[0], () => console.log("Base image loaded"));
    imgLeftEye = loadImage(images[1], () => console.log("Left eye image loaded"));
    imgRightEye = loadImage(images[2], () => console.log("Right eye image loaded"));
    imgMouth = loadImage(images[3], () => console.log("Mouth image loaded"));
    //img = loadImage("https://cdn.jsdelivr.net/gh/ml5js/ml5-examples@release/p5js/FaceApi/FaceApi_Image_Landmarks/assets/frida.jpg");
}

function setup(){
    let w = 500, h = w*imgBase.height/imgBase.width;
	createCanvas(w, h);
    imgBase.resize(width, height);
    imgLeftEye.resize(width, 0);
    imgRightEye.resize(width, 0);
    imgMouth.resize(width, 0);

    noLoop();

    noFill();
    strokeWeight(2);
    stroke(0);

    faceapi = ml5.faceApi(detectionOptions, modelReady);
}

function draw(){
	//background(200);
    image(imgBase, 0, 0, width, height);
}

function modelReady() {
    console.log('ready!');
    //console.log(faceapi);

    faceapi.detectSingle(imgBase, gotResultsBase);
    faceapi.detectSingle(imgLeftEye, gotResultsLeftEye);
    faceapi.detectSingle(imgRightEye, gotResultsRightEye);
    faceapi.detectSingle(imgMouth, gotResultsMouth);
}

// BASE

function gotResultsBase(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    // console.log(result)
    let detectionsBase = result;

    if (detectionsBase) {
        //drawLandmarks(detectionsBase);

        verticesLeftEye = normalize(detectionsBase.parts.leftEye, width, height);
        [centroidLeftEye, radLeftEye] = analyzeShape(verticesLeftEye);

        verticesRightEye = normalize(detectionsBase.parts.rightEye, width, height);
        [centroidRightEye, radRightEye] = analyzeShape(verticesRightEye);

        verticesMouth = normalize(detectionsBase.parts.mouth, width, height);
        [centroidMouth, radMouth] = analyzeShape(verticesMouth);
    }
}

// EYES

function gotResultsLeftEye(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    // console.log(result)
    let detectionsLeftEye = result;

    if (detectionsLeftEye) {
        let vertices = normalize(detectionsLeftEye.parts.leftEye, imgLeftEye.width, imgLeftEye.height);
        drawEye(vertices, imgLeftEye, centroidLeftEye, radLeftEye);
    }
}

function gotResultsRightEye(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    // console.log(result)
    let detectionsRightEye = result;

    if (detectionsRightEye) {
        let vertices = normalize(detectionsRightEye.parts.rightEye, imgRightEye.width, imgRightEye.height);
        drawEye(vertices, imgRightEye, centroidRightEye, radRightEye);
    }
}

function drawEye(vertices, img, centroidEye, radEye) {
    let [centroid, rad] = analyzeShape(vertices);
    let border = rad*1.5;

    let myMask = createGraphics(img.width, img.height);
    myMask.fill(0);
    myMask.noStroke();
    myMask.beginShape();
    vertices.forEach((item) => {
        let theta = atan2(item[1]-centroid[1], item[0]-centroid[0]);
        let r = dist(centroid[0], centroid[1], item[0], item[1]);
        let x = centroid[0] + (r+border)*cos(theta);
        let y = centroid[1] + (r+border)*sin(theta);
        myMask.vertex(x*img.width, y*img.height);
    })
    myMask.endShape(CLOSE);
    //myMask.filter(BLUR, 5);
    img.mask(myMask);

    let dx = width*(centroidEye[0]-radEye-border);
    let dy = height*(centroidEye[1]-radEye-border);
    let dWidth = width*(radEye+border)*2;
    let dHeight = height*(radEye+border)*2;
    let sx = img.width*(centroid[0]-rad-border);
    let sy = img.height*(centroid[1]-rad-border);
    let sWidth = img.width*(rad+border)*2;
    let sHeight = img.height*(rad+border)*2;
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 5;
    drawingContext.shadowColor = "black";
    image(img, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight);
    console.log("eye drawn");
}

// MOUTH

function gotResultsMouth(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    // console.log(result)
    let detectionsMouth = result;

    if (detectionsMouth) {
        let vertices = normalize(detectionsMouth.parts.mouth, imgMouth.width, imgMouth.height);
        drawMouth(vertices);
    }
}

function drawMouth(vertices) {
    let [centroid, rad] = analyzeShape(vertices);
    let border = rad*0.5;

    let myMask = createGraphics(imgMouth.width, imgMouth.height);
    myMask.fill(0);
    myMask.noStroke();
    myMask.beginShape();
    vertices.forEach((item) => {
        let theta = atan2(item[1]-centroid[1], item[0]-centroid[0]);
        let r = dist(centroid[0], centroid[1], item[0], item[1]);
        let x = centroid[0] + (r+border)*cos(theta);
        let y = centroid[1] + (r+border)*sin(theta);
        myMask.vertex(x*imgMouth.width, y*imgMouth.height);
    })
    myMask.endShape(CLOSE);
    //myMask.filter(BLUR, 5);
    imgMouth.mask(myMask);

    let dx = width*(centroidMouth[0]-radMouth-border);
    let dy = height*(centroidMouth[1]-radMouth-border);
    let dWidth = width*(radMouth+border)*2;
    let dHeight = height*(radMouth+border)*2;
    let sx = imgMouth.width*(centroid[0]-rad-border);
    let sy = imgMouth.height*(centroid[1]-rad-border);
    let sWidth = imgMouth.width*(rad+border)*2;
    let sHeight = imgMouth.height*(rad+border)*2;
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 5;
    drawingContext.shadowColor = "black";
    image(imgMouth, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight);
    console.log("mouth drawn");
}

// UTILITIES

function normalize(vertices, w, h) {
    let newVertices = [];
    vertices.forEach(item => {
        newVertices.push([item._x/w, item._y/h]);
    })
    return newVertices;
}

function analyzeShape(vertices) {
    let cx = 0, cy = 0;
    for (let item of vertices) {
        cx += item[0];
        cy += item[1];
    }
    cx /= vertices.length;
    cy /= vertices.length;
    let centroid = [cx, cy];

    let maxRad = 0;
    //let minRad = Infinity;
    for (let item of vertices) {
        let r = dist(cx, cy, item[0], item[1]);
        if (r > maxRad) maxRad = r;
        //if (r < minRad) minRad = r;
    }

    return [centroid, maxRad];
}

// TEMPLATE

function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    // console.log(result)
    detections = result;

    // background(220);
    background(255);
    image(img, 0, 0, width, height);
    if (detections) {
        // console.log(detections);
        blendMode(DIFFERENCE);
        //drawBox(detections);
        drawLandmarks(detections);
    }
}

function drawBox(detections) {
    const alignedRect = detections.alignedRect;
    const {_x, _y, _width, _height} = alignedRect._box;
    rect(_x, _y, _width, _height)
}

function drawLandmarks(detections) {
    push();

    // mouth
    beginShape();
    detections.parts.mouth.forEach(item => {
        vertex(item._x, item._y);
    })
    endShape(CLOSE);

    // nose
    beginShape();
    detections.parts.nose.forEach(item => {
        vertex(item._x, item._y);
    })
    endShape(CLOSE);

    // left eye
    beginShape();
    detections.parts.leftEye.forEach(item => {
        vertex(item._x, item._y);
    })
    endShape(CLOSE);

    // right eye
    beginShape();
    detections.parts.rightEye.forEach(item => {
        vertex(item._x, item._y);
    })
    endShape(CLOSE);

    // right eyebrow
    beginShape();
    detections.parts.rightEyeBrow.forEach(item => {
        vertex(item._x, item._y);
    })
    endShape();

    // left eyebrow
    beginShape();
    detections.parts.leftEyeBrow.forEach(item => {
        vertex(item._x, item._y);
    })
    endShape();

    pop();
}