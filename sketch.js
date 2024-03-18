console.log('ml5 version:', ml5.version);
  
let faceapi;

let imgBase;
let detectionsBase;

let centroidLeftEye;
let radLeftEye;

let imgLeftEye;
let detectionsLeftEye;

let imgRightEye;
let detectionsRightEye;

// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

function preload() {
    imgBase = loadImage("assets/301060.jpg");
    imgLeftEye = loadImage("assets/3555297.jpg");
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
    console.log(faceapi);

    faceapi.detectSingle(imgBase, gotResultsBase);
    faceapi.detectSingle(imgLeftEye, gotResultsLeftEye);
}

// BASE

function gotResultsBase(err, result) {
    if (err) {
        console.log(err)
        return
    }
    // console.log(result)
    detectionsBase = result;

    if (detectionsBase) {
        verticesLeftEye = normalize(detectionsBase.parts.leftEye, width, height);
        [centroidLeftEye, radLeftEye] = analyzeShape(verticesLeftEye);
    }
}

function gotResultsLeftEye(err, result) {
    if (err) {
        console.log(err)
        return
    }
    // console.log(result)
    detectionsLeftEye = result;

    if (detectionsLeftEye) {
        let vertices = normalize(detectionsLeftEye.parts.leftEye, imgLeftEye.width, imgLeftEye.height);
        drawLeftEye(vertices);
    }
}

// LEFT EYE

function drawLeftEye(vertices) {
    let [centroid, rad] = analyzeShape(vertices);
    let border = rad*2;

    let trans = (x, y) => {
        let xNew = centroidLeftEye[0] + radLeftEye*(x-centroid[0])/rad;
        let yNew = centroidLeftEye[1] + radLeftEye*(y-centroid[1])/rad;
        return [xNew, yNew];
    };

    /*
    fill(255, 0, 0);
    noStroke();
    beginShape();
    vertices.forEach(item => {
        let [x, y] = trans(item[0], item[1]);
        vertex(x*width, y*height);
    })
    endShape(CLOSE);
    */

    let myMask = createGraphics(imgLeftEye.width, imgLeftEye.height);
    myMask.fill(0);
    myMask.noStroke();
    myMask.beginShape();
    vertices.forEach((item) => {
        let theta = atan2(item[1]-centroid[1], item[0]-centroid[0]);
        let r = dist(centroid[0], centroid[1], item[0], item[1]);
        let x = centroid[0] + (r+border)*cos(theta);
        let y = centroid[1] + (r+border)*sin(theta);
        myMask.vertex(x*imgLeftEye.width, y*imgLeftEye.height);
        //console.log(item[0]*imgLeftEye.width, item[1]*imgLeftEye.height);
        /*
        fill(0,255,0);
        noStroke();
        let [x1, y1] = trans(x, y);
        circle(x1*width, y1*height, 3);
        */
    })
    myMask.endShape(CLOSE);
    imgLeftEye.mask(myMask);
    //image(myMask, 0, 0, width, height, 0, 0, imgLeftEye.width, imgLeftEye.height)

    let dx = width*(centroidLeftEye[0]-radLeftEye-border);
    let dy = height*(centroidLeftEye[1]-radLeftEye-border);
    let dWidth = width*(radLeftEye+border)*2;
    let dHeight = height*(radLeftEye+border)*2;
    let sx = imgLeftEye.width*(centroid[0]-rad-border);
    let sy = imgLeftEye.height*(centroid[1]-rad-border);
    let sWidth = imgLeftEye.width*(rad+border)*2;
    let sHeight = imgLeftEye.height*(rad+border)*2;
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 5;
    drawingContext.shadowColor = "black";
    image(imgLeftEye, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight);
    console.log("left eye drawn");
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