console.log('ml5 version:', ml5.version);
  
let faceapi;

let imgBase;
let detectionsBase;

let centerLeftEye;
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

function gotResultsBase(err, result) {
    if (err) {
        console.log(err)
        return
    }
    // console.log(result)
    detectionsBase = result;

    if (detectionsBase) {
        verticesLeftEye = normalize(detectionsBase.parts.leftEye, width, height);
        [centerLeftEye, radLeftEye] = analyzeEye(verticesLeftEye);
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

function drawLeftEye(vertices) {
    let [center, rad] = analyzeEye(vertices);

    let trans = (x, y) => {
        let xNew = centerLeftEye[0] + radLeftEye*(x-center[0])/rad;
        let yNew = centerLeftEye[1] + radLeftEye*(y-center[1])/rad;
        return [xNew, yNew];
    };

    fill(255, 0, 0);
    noStroke();
    beginShape();
    vertices.forEach(item => {
        let [x, y] = trans(item[0], item[1]);
        vertex(x*width, y*height);
    })
    endShape(CLOSE);
    image(imgLeftEye, width*(centerLeftEye[0]-radLeftEye), height*(centerLeftEye[1]-radLeftEye), width*radLeftEye*2, height*radLeftEye*2, imgLeftEye.width*(center[0]-rad), imgLeftEye.height*(center[1]-rad), imgLeftEye.width*rad*2, imgLeftEye.height*rad*2);
    console.log("left eye drawn");
}

function normalize(vertices, w, h) {
    let newVertices = [];
    vertices.forEach(item => {
        newVertices.push([item._x/w, item._y/h]);
    })
    return newVertices
}

function analyzeEye(vertices) {
    let cx = 0, cy = 0;
    for (let item of vertices) {
        cx += item[0];
        cy += item[1];
    }
    cx /= vertices.length;
    cy /= vertices.length;
    let center = [cx, cy];

    let maxRad = 0;
    for (let item of vertices) {
        let r = dist(cx, cy, item[0], item[1]);
        if (r > maxRad) maxRad = r;
    }

    return [center, maxRad];
}


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