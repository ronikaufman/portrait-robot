/*
IDEAS:
- add nose

POSSIBLE FEATURES:
- same/different eyes/features
- cutting type (collage with shadow, round with blur, bounding rect with no shadow, whole horizontal bands)

(LOOSE) CRITERIA FOR PORTRAITS:
- face-to-width ratio between 0.2 and 0.4
- eyes open, looking toward the "camera"
- not too dark
- the face is the main focus
- lips visible, no thick moustaches
- not too blurry
- face is straight up, not oblique
- vertical
- nothing in front of the face (hands, etc.)
- no miniatures, no border/frame
- only 1 person
- no text

(LOOSE) CRITERIA FOR BACKGROUND IDEAS:
- landscape
- no borders
- no people

TO FIX/DO:
- check if sizing/rotation of face parts is right
- loading animation?
- implement highlight library
- decide on canvas sizing
- check if resolution is not too low
- change size of elements depending on face-to-width ratio
*/

//console.log('ml5 version:', ml5.version);

let bodyPix;
let faceApi;

let imgBase;
let imgLeftEye;
let imgRightEye;
let imgMouth;
let imgBackground;

let baseSteersLeft;
let verticesLeftEye;
let verticesRightEye;
let verticesMouth;

let loadCount = 0;

// by default all options are set to true
const faceApiOptions = {
    withLandmarks: true,
    withDescriptors: false,
}

function preload() {
    loadTable("portraits/data.csv", "ssv", "header", (data) => {
        let rows = shuffle(data.rows);
        //rows[0] = data.rows[data.rows.length-1];
        imgBase = loadImage("portraits/"+rows[0].obj.ref+"."+rows[0].obj.extension, () => {console.log("Base image loaded: " + rows[0].obj.ref);everythingLoaded()});
        imgLeftEye = loadImage("portraits/"+rows[1].obj.ref+"."+rows[1].obj.extension, () => {console.log("Left eye image loaded: " + rows[1].obj.ref);everythingLoaded()});
        imgRightEye = loadImage("portraits/"+rows[2].obj.ref+"."+rows[2].obj.extension, () => {console.log("Right eye image loaded: " + rows[2].obj.ref);everythingLoaded()});
        imgMouth = loadImage("portraits/"+rows[3].obj.ref+"."+rows[3].obj.extension, () => {console.log("Mouth image loaded: " + rows[3].obj.ref);everythingLoaded()});
    });
    loadTable("backgrounds/data.csv", "ssv", "header", (data) => {
        let rows = shuffle(data.rows);
        //rows[0] = data.rows[data.rows.length-1];
        console.log(rows[0]);
        imgBackground = loadImage("backgrounds/"+rows[0].obj.ref+"."+rows[0].obj.extension, () => {console.log("Background image loaded: " + rows[0].obj.ref);everythingLoaded()});
    });
    bodyPix = ml5.bodyPix(() => {console.log("Body Pix loaded");everythingLoaded()});
}

function everythingLoaded() {
    if (loadCount++ < 5) {
        return;
    }
    console.log("Everything is loaded!");

    let w = 500, h = w*imgBase.height/imgBase.width;
	resizeCanvas(w, h);
    imgBase.resize(width, height);
    imgLeftEye.resize(width, 0);
    imgRightEye.resize(width, 0);
    imgMouth.resize(width, 0);

    imgBackground.resize(0, height);

    console.log("Resizing done: "+width+" "+height);

    image(imgBackground, random(width-imgBackground.width), 0);

    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 5;
    drawingContext.shadowColor = "#00000095";

    bodyPix.segment(imgBase, bodyPixResults);
    //faceApi = ml5.faceApi(faceApiOptions, faceApiReady);
}

function setup() {
	createCanvas(500, 500);

    noLoop();

    //background(0);
    textAlign(CENTER, CENTER);
    textFont("Times New Roman", 16);
    fill(255);
    noStroke();
    text("loading...", width/2, height/2);

    console.log("Setup done");
}

/*
function draw() {
    
}
*/

// ********** BodyPix **********

function bodyPixResults(err, result) {
    if (err) {
        console.log(imgBase.width, imgBase.height)
        console.log(err);
        return;
    }

    console.log("bodyPix ready");
    let backgroundMask = result.backgroundMask;
    backgroundMask.filter(BLUR, 5);

    let points = getMaskPolygon(backgroundMask);
    points = convexHull(points);
    let img = imgBase.get();
    let myMask = createGraphics(img.width, img.height);
    myMask.fill(0);
    myMask.noStroke();
    myMask.beginShape();
    points.forEach((item) => {
        let x = item[0];
        let y = item[1];
        myMask.vertex(x, y);
    })
    myMask.endShape(CLOSE);
    //myMask.filter(BLUR, 20);
    img.mask(myMask);
    myMask.remove();

    translate(width/2, height/2);
    scale(0.95);
    rotate(random(-1, 1)*0.03);
    translate(-width/2, -height/2);

    image(img, 0, 0);

    faceApi = ml5.faceApi(faceApiOptions, faceApiReady);
}

function getMaskPolygon(mask) {
    let points = [];
    
    // marchin squares algorithm to get the outline(s) of the shape drawn in mask
    let n = 50;
    let sx = mask.width/n;
    let sy = mask.height/n;
    for (let x = 0; x < mask.width; x += sx) {
        for (let y = 0; y < mask.height; y += sy) {
            let inNW = pointInMask(mask, x, y);
            let inNE = pointInMask(mask, x+sx, y);
            let inSE = pointInMask(mask, x+sx, y+sy);
            let inSW = pointInMask(mask, x, y+sy);
            if (!inNW && inNE && inSE && inSW) {
                points.push([x+sx/2, y]);
                points.push([x+sx, y]);
                points.push([x+sx, y+sy]);
                points.push([x, y+sy]);
                points.push([x, y+sy/2]);
            } else if (inNW && !inNE && inSE && inSW) {
                points.push([x+sx/2, y]);
                points.push([x+sx, y+sy/2]);
                points.push([x+sx, y+sy]);
                points.push([x, y+sy]);
                points.push([x, y]);
            } else if (inNW && inNE && !inSE && inSW) {
                points.push([x+sx, y+sy/2]);
                points.push([x+sx/2, y+sy]);
                points.push([x, y+sy]);
                points.push([x, y]);
                points.push([x+sx, y]);
            } else if (inNW && inNE && inSE && !inSW) {
                points.push([x, y+sy/2]);
                points.push([x, y]);
                points.push([x+sx, y]);
                points.push([x+sx, y+sy]);
                points.push([x+sx/2, y+sy]);
            } else if (!inNW && !inNE && inSE && inSW) {
                points.push([x, y+sy/2]);
                points.push([x+sx, y+sy/2]);
                points.push([x+sx, y+sy]);
                points.push([x, y+sy]);
            } else if (inNW && !inNE && !inSE && inSW) {
                points.push([x+sx/2, y]);
                points.push([x+sx/2, y+sy]);
                points.push([x, y+sy]);
                points.push([x, y]);
            } else if (inNW && inNE && !inSE && !inSW) {
                points.push([x, y+sy/2]);
                points.push([x, y]);
                points.push([x+sx, y]);
                points.push([x+sx, y+sy/2]);
            } else if (!inNW && inNE && inSE && !inSW) {
                points.push([x+sx/2, y]);
                points.push([x+sx, y]);
                points.push([x+sx, y+sy]);
                points.push([x+sx/2, y+sy]);
            } else if (inNW && !inNE && !inSE && !inSW) {
                points.push([x, y]);
                points.push([x+sx/2, y]);
                points.push([x, y+sy/2]);
            } else if (!inNW && inNE && !inSE && !inSW) {
                points.push([x+sx/2, y]);
                points.push([x+sx, y]);
                points.push([x+sx, y+sy/2]);
            } else if (!inNW && !inNE && inSE && !inSW) {
                points.push([x+sx, y+sy]);
                points.push([x+sx/2, y+sy]);
                points.push([x+sx, y+sy/2]);
            } else if (!inNW && !inNE && !inSE && inSW) {
                points.push([x+sx/2, y+sy]);
                points.push([x, y+sy]);
                points.push([x, y+sy/2]);
            } else if (!inNW && inNE && !inSE && inSW) {
                points.push([x+sx/2, y]);
                points.push([x+sx, y]);
                points.push([x+sx, y+sy/2]);
                points.push([x+sx/2, y+sy]);
                points.push([x, y+sy]);
                points.push([x, y+sy/2]);
            } else if (inNW && !inNE && inSE && !inSW) {
                points.push([x+sx/2, y]);
                points.push([x+sx, y+sy/2]);
                points.push([x+sx, y+sy]);
                points.push([x+sx/2, y+sy]);
                points.push([x, y+sy/2]);
                points.push([x, y]);
            } else if (inNW && inNE && inSE && inSW) {
                points.push([x, y]);
                points.push([x+sx, y]);
                points.push([x+sx, y+sy]);
                points.push([x, y+sy]);
            }
        }
    }

    /*
    noFill();
    stroke(0, 0, 255);
    beginShape();
    for (let p of points) {
        vertex(p[0], p[1]);
    }
    endShape(CLOSE);
    */

    //console.log(points);
    
    return points;
}

function pointInMask(mask, x, y) {
    let col = mask.get(x, y);
    return col[3] > 0;
}

// ********** Face-Api **********

function faceApiReady() {
    console.log("face-api ready");

    faceApi.detectSingle(imgBase, faceApiResultsBase);
    faceApi.detectSingle(imgLeftEye, faceApiResultsLeftEye);
    faceApi.detectSingle(imgRightEye, faceApiResultsRightEye);
    faceApi.detectSingle(imgMouth, faceApiResultsMouth);

    //image(imgBase, 0, 0, width, height);
}

// BASE CALLBACK

function faceApiResultsBase(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    let detectionsBase = result;

    if (detectionsBase) {
        //drawBox(detectionsBase);
        //drawFaceRect(detectionsBase);
        //drawLandmarks(detectionsBase);
        console.log("face to width ratio: " + detectionsBase.alignedRect._box._width/width);
        console.log("aspect ratio: " + width/height);
        baseSteersLeft = steeringLeft(detectionsBase);
        //console.log("Base image steers left? " + baseSteersLeft);

        verticesLeftEye = normalize(detectionsBase.parts.leftEye, width, height);
        verticesRightEye = normalize(detectionsBase.parts.rightEye, width, height);
        verticesMouth = normalize(detectionsBase.parts.mouth, width, height);
    }
}

// PARTS CALLBACKS & DRAWING

function faceApiResultsLeftEye(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    let detectionsLeftEye = result;

    if (detectionsLeftEye) {
        let thisSteersLeft = steeringLeft(detectionsLeftEye);
        let steersInCorrectWay = (thisSteersLeft == baseSteersLeft);

        let part = steersInCorrectWay ? detectionsLeftEye.parts.leftEye : detectionsLeftEye.parts.rightEye;
        let vertices = normalize(part, imgLeftEye.width, imgLeftEye.height);
        let [centroidLeftEye, radLeftEye, angleLeftEye] = analyzeShape(verticesLeftEye);
        drawShape(vertices, imgLeftEye, centroidLeftEye, radLeftEye, angleLeftEye, 1.5, !steersInCorrectWay);
    }
}

function faceApiResultsRightEye(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    let detectionsRightEye = result;

    if (detectionsRightEye) {
        let thisSteersLeft = steeringLeft(detectionsRightEye);
        let steersInCorrectWay = (thisSteersLeft == baseSteersLeft);

        let part = steersInCorrectWay ? detectionsRightEye.parts.rightEye : detectionsRightEye.parts.leftEye;
        let vertices = normalize(part, imgRightEye.width, imgRightEye.height);
        let [centroidRightEye, radRightEye, angleRightEye] = analyzeShape(verticesRightEye);
        drawShape(vertices, imgRightEye, centroidRightEye, radRightEye, angleRightEye, 1.5, !steersInCorrectWay);
    }
}

function faceApiResultsMouth(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    let detectionsMouth = result;

    if (detectionsMouth) {
        let thisSteersLeft = steeringLeft(detectionsMouth);
        let steersInCorrectWay = (thisSteersLeft == baseSteersLeft);

        let vertices = normalize(detectionsMouth.parts.mouth, imgMouth.width, imgMouth.height);
        let [centroidMouth, radMouth, angleMouth] = analyzeShape(verticesMouth);
        vertices = convexHull(vertices);
        drawShape(vertices, imgMouth, centroidMouth, radMouth, angleMouth, 0.5, !steersInCorrectWay);
    }
}

function drawShape(vertices, img, targetCentroid, targetRad, targetAngle, borderFactor, flipIt) {
    let [centroid, rad, angle] = analyzeShape(vertices);
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
    myMask.remove();

    let targetBorder = targetRad*borderFactor;
    let ratio = (img.width/img.height)/(width/height);
    
    let dWidth = width*(targetRad+targetBorder)*2*ratio;
    let dHeight = height*(targetRad+targetBorder);
    let dx = width*targetCentroid[0] - dWidth/2;
    let dy = height*targetCentroid[1] - dHeight/2;

    let sWidth = img.width*(rad+border)*2;
    let sHeight = img.height*(rad+border);
    let sx = img.width*centroid[0] - sWidth/2;
    let sy = img.height*centroid[1] - sHeight/2;

    push();
    translate(dx+dWidth/2, dy+dHeight/2);
    let rot = targetAngle-angle;
    if (abs(rot) > PI/2) rot += PI;
    rotate(rot);
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

    let angle1 = atan2(vertices[0][1]-cy, vertices[0][0]-cx);
    let angle2 = atan2(vertices[1][1]-cy, vertices[1][0]-cx);

    return [centroid, maxRad, (angle1+angle2)/2];
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

function faceApiResults(err, result) {
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

/*
function drawLandmarks(detections) {
    let landmarks = detections.landmarks._positions;
    for (let lm of landmarks) {
        circle(lm._x, lm._y, 5);
    }
}
*/

function drawBox(detections) {
    let alignedRect = detections.alignedRect;
    let {_x, _y, _width, _height} = alignedRect._box;
    rect(_x, _y, _width, _height);
}

function drawFaceRect(detections) {
    let alignedRect = detections.alignedRect;
    let {_x, _y, _width, _height} = alignedRect._box;
    //_x = 0;
    //_width = width;

    //scale(width/_width)
    //translate(-_x, -_y);
    image(imgBase, _x, _y, _width, _height, _x, _y, _width, _height);
}

function drawLandmarks(detections) {
    push();

    noFill();
    stroke(0, 255, 0);
    strokeWeight(2);

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

function sobelFilter(img) {
    noStroke();
    //colorMode(HSB, PI, 255, 255);
    let step = 1;
    for (let x = step; x < img.width-step; x += step) {
        for (let y = step; y < img.height-step; y += step) {
            let tl = brightness(img.get(x-step, y-step)); // top left
            let l = brightness(img.get(x-step, y)); // left
            let bl = brightness(img.get(x-step, y+step)); // bottom left
            let t = brightness(img.get(x, y-step)); // top
            let b = brightness(img.get(x, y+step)); // bottom
            let tr = brightness(img.get(x+step, y-step)); // top right
            let r = brightness(img.get(x+step, y)); // right
            let br = brightness(img.get(x+step, y+step)); // bottom right
          
            let Gx = tl + 2*l + bl - tr - 2*r - br;
            let Gy = tl + 2*t + tr - bl - 2*b - br;
            let Gz = sqrt(sq(Gx)+sq(Gy));
            let theta = atan(Gy/Gx);
          
            //fill(PI/2, 255, Gz); 
            fill(0, 255, 255, Gz); 
            square(x, y, step);
        }
    }
}