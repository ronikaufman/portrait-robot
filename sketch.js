console.log('ml5 version:', ml5.version);
  
let faceapi;

let imgBase;
let imgLeftEye;
let imgRightEye;

let verticesLeftEye;
let centroidLeftEye;
let radLeftEye;

let verticesRightEye;
let centroidRightEye;
let radRightEye;

// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

function preload() {
    imgBase = loadImage("assets/301060.jpg");
    imgLeftEye = loadImage("assets/3555297.jpg");
    imgRightEye = loadImage("assets/334018.jpg");
    //img = loadImage("https://cdn.jsdelivr.net/gh/ml5js/ml5-examples@release/p5js/FaceApi/FaceApi_Image_Landmarks/assets/frida.jpg");
}

function setup(){
    let w = 400, h = w*imgBase.height/imgBase.width;
	createCanvas(w, h);
    imgBase.resize(width, height);

    noLoop();

    noFill();
    strokeWeight(2);
    stroke(0);

    faceapi = ml5.faceApi(detection_options, modelReady);
}

function draw(){
	background(200);
    image(imgBase, 0, 0, width, height);
}

function modelReady() {
    console.log('ready!');
    //console.log(faceapi);

    faceapi.detectSingle(imgBase, gotResultsBase);
    faceapi.detectSingle(imgLeftEye, gotResultsLeftEye);
    faceapi.detectSingle(imgRightEye, gotResultsRightEye);
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
        verticesLeftEye = normalize(detectionsBase.parts.leftEye, width, height);
        [centroidLeftEye, radLeftEye] = analyzeShape(verticesLeftEye);

        verticesRightEye = normalize(detectionsBase.parts.rightEye, width, height);
        [centroidRightEye, radRightEye] = analyzeShape(verticesRightEye);
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

function drawBox(detections){
    const alignedRect = detections.alignedRect;
    const {_x, _y, _width, _height} = alignedRect._box;
    rect(_x, _y, _width, _height)
}

function drawLandmarks(detections){
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

    // left eye
    beginShape();
    detections.parts.leftEyeBrow.forEach(item => {
        vertex(item._x, item._y);
    })
    endShape();

    pop();
}