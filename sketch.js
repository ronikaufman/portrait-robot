/*
IDEAS:
- flip eyes in case of different face orientation (see distance to box)
- rotate eyes/mouth to fit better
- use facemesh to cut more face pieces
- add nose
- no moustaches
- change background
- make it more AI related

POSSIBLE FEATURES:
- same/different eyes
- cutting type (collage with shadow, round with blur, bounding rect with no shadow, whole horizontal bands)

CRITERIA FOR PORTRAITS:
- face-to-width ratio approximately between 0.2 and 0.4
- eyes open, preferably looking toward the "camera"
- not too dark
- the face is the main focus
- lips visible, no thick moustaches
- not too blurry
- face is straight up, not oblique
- vertical

TO FIX:
- sizing is wrong?
- rectangles fit better?
*/

//console.log('ml5 version:', ml5.version);
  
let faceapi;

let imgBase;
let imgLeftEye;
let imgRightEye;
let imgMouth;

let baseSteersLeft;
let verticesLeftEye;
let verticesRightEye;
let verticesMouth;

// by default all options are set to true
const detectionOptions = {
    withLandmarks: true,
    withDescriptors: false,
}

function preload() {
    let images = [
        "301060.jpg", "3555297.jpg", "334018.jpg", "311653.jpg", "236796.jpg", 
        "302001.jpg", "3041129.jpg", "1758997.jpg", "1226357.jpg", "249671.jpg", 
        "1289864.jpg", "1833064.jpg", "251624.jpg", "303870.jpg", "239168.jpg", 
        "311210.jpg", "255972.jpg", "334216.jpg", "273589.jpg", "1391115.jpg", 
        "243131.jpg"
    ];
    shuffle(images, true);
    console.log(images);

    imgBase = loadImage("assets/"+images[0], () => console.log("Base image loaded"));
    imgLeftEye = loadImage("assets/"+images[1], () => console.log("Left eye image loaded"));
    imgRightEye = loadImage("assets/"+images[2], () => console.log("Right eye image loaded"));
    imgMouth = loadImage("assets/"+images[3], () => console.log("Mouth image loaded"));
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

// BASE CALLBACK

function gotResultsBase(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    // console.log(result)
    let detectionsBase = result;
    //console.log(result);

    if (detectionsBase) {
        //drawLandmarks(detectionsBase);
        //drawBox(detectionsBase);
        //console.log("face to width ratio:" + detectionsBase.alignedRect._box._width/width);
        baseSteersLeft = steeringLeft(detectionsBase);
        //console.log("Base image steers left? " + baseSteersLeft);

        verticesLeftEye = normalize(detectionsBase.parts.leftEye, width, height);
        verticesRightEye = normalize(detectionsBase.parts.rightEye, width, height);
        verticesMouth = normalize(detectionsBase.parts.mouth, width, height);
    }
}

// PARTS CALLBACKS & DRAWING

function gotResultsLeftEye(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    // console.log(result)
    let detectionsLeftEye = result;

    if (detectionsLeftEye) {
        let thisSteersLeft = steeringLeft(detectionsLeftEye);
        let steersInCorrectWay = (thisSteersLeft == baseSteersLeft);

        let part = steersInCorrectWay ? detectionsLeftEye.parts.leftEye : detectionsLeftEye.parts.rightEye;
        let vertices = normalize(part, imgLeftEye.width, imgLeftEye.height);
        let [centroidLeftEye, radLeftEye] = analyzeShape(verticesLeftEye);
        drawShape(vertices, imgLeftEye, centroidLeftEye, radLeftEye, 1.5, !steersInCorrectWay);
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
        let thisSteersLeft = steeringLeft(detectionsRightEye);
        let steersInCorrectWay = (thisSteersLeft == baseSteersLeft);

        let part = steersInCorrectWay ? detectionsRightEye.parts.rightEye : detectionsRightEye.parts.leftEye;
        let vertices = normalize(part, imgRightEye.width, imgRightEye.height);
        let [centroidRightEye, radRightEye] = analyzeShape(verticesRightEye);
        drawShape(vertices, imgRightEye, centroidRightEye, radRightEye, 1.5, !steersInCorrectWay);
    }
}

function gotResultsMouth(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    // console.log(result)
    let detectionsMouth = result;

    if (detectionsMouth) {
        let thisSteersLeft = steeringLeft(detectionsMouth);
        let steersInCorrectWay = (thisSteersLeft == baseSteersLeft);

        let vertices = normalize(detectionsMouth.parts.mouth, imgMouth.width, imgMouth.height);
        let [centroidMouth, radMouth] = analyzeShape(verticesMouth);
        vertices = convexHull(vertices);
        drawShape(vertices, imgMouth, centroidMouth, radMouth, 0.5, !steersInCorrectWay);
    }
}

function drawShape(vertices, img, targetCentroid, targetRad, borderFactor, flipIt) {
    let [centroid, rad] = analyzeShape(vertices);
    let border = rad*borderFactor;

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

    let targetBorder = min(targetRad, rad)*borderFactor;
    let ratio = (img.width/img.height)/(width/height);
    
    let dWidth = width*(targetRad+targetBorder)*2*ratio;
    let dHeight = height*(targetRad+targetBorder)*2;
    let dx = width*targetCentroid[0] - dWidth/2;
    let dy = height*targetCentroid[1] - dHeight/2;

    let sWidth = img.width*(rad+border)*2;
    let sHeight = img.height*(rad+border)*2;
    let sx = img.width*centroid[0] - sWidth/2;
    let sy = img.height*centroid[1] - sHeight/2;

    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 5;
    drawingContext.shadowColor = "black";

    push();
    translate(dx+dWidth/2, dy+dHeight/2);
    if (flipIt) scale(-1, 1);
    translate(-dx-dWidth/2, -dy-dHeight/2);
    //rect(dx, dy, dWidth, dHeight);
    image(img, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight);
    pop();
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

function convexHull(points) {
    // adapted from https://en.wikipedia.org/wiki/Gift_wrapping_algorithm#Pseudocode
    points.sort((p, q) => p[0] - q[0]);
    let hull = [];
    let i = 0;
    let endPoint;
    let pointOnHull = points[0];
    do {
        hull.push(pointOnHull);
        endPoint = points[0];
        for (let j = 0; j < points.length; j++) {
            let p = createVector(endPoint[0]-pointOnHull[0], endPoint[1]-pointOnHull[1]);
            let q = createVector(points[j][0]-pointOnHull[0], points[j][1]-pointOnHull[1]);
            if (pointsAreEqual(endPoint, pointOnHull) || (p.cross(q)).z < 0) {
                endPoint = points[j];
            }
        }
        i++;
        pointOnHull = endPoint;
    } while (!pointsAreEqual(endPoint, points[0]));
	return hull;
}

function pointsAreEqual(a, b) {
    return a[0] == b[0] && a[1] == b[1];
}

function getCentroid(part) {
    let cx = 0, cy = 0;
    for (let item of part) {
        cx += item._x;
        cy += item._y;
    }
    cx /= part.length;
    cy /= part.length;
    return [cx, cy];
}

function steeringLeft(detections) {
    let centroidLeftEye = getCentroid(detections.parts.leftEye);
    let centroidRightEye = getCentroid(detections.parts.rightEye);
    let {_x, _y, _width, _height} = detections.alignedRect._box;
    let distToLeftEye = centroidLeftEye[0] - _x;
    let distToRightEye = _x+_width - centroidRightEye[0];
    return distToLeftEye < distToRightEye;
}

// OTHER STUFF

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

function drawLandmarks(detections) {
    let landmarks = detections.landmarks._positions;
    for (let lm of landmarks) {
        circle(lm._x, lm._y, 5);
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