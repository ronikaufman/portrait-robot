let img;
let bodyPix;
let faceApi;

let loadCount = 0;

let idx = 149; // <-- put in the index of the element of portrait_data that you want to download the bodyPix and face-api results from

const faceApiOptions = {
    withLandmarks: true,
    withDescriptors: false
}

function preload() {
    let el = portraits_data[idx];
    img = loadImage("../portraits/"+el[0]+"."+el[1], () => {console.log("image loaded: " + el[0]);everythingLoaded()});
    bodyPix = ml5.bodyPix(() => {console.log("Body Pix loaded");everythingLoaded()});
    faceApi = ml5.faceApi(faceApiOptions, () => {console.log("face-api loaded");everythingLoaded()});
}

function everythingLoaded() {
    if (loadCount++ < 2) {
        return;
    }
    console.log("Everything is loaded!");

    img.resize(500, 0);

    bodyPix.segment(img, bodyPixResults);
    faceApi.detectSingle(img, faceApiResults);
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    noLoop();

    textAlign(CENTER, CENTER);
    textFont("Times New Roman", 16);
    fill(255);
    noStroke();
    text("Hey, I'm just working.\nWorking hard so I can please you.", width/2, height/2);

    console.log("Setup done");
}

// BODYPIX

function bodyPixResults(err, result) {
    if (err) {
        console.log(err);
        return;
    }

    console.log("bodyPix ready");
    let backgroundMask = result.backgroundMask;
    backgroundMask.filter(BLUR, 8);

    let points = getMaskPolygon(backgroundMask);
    points = normalizeBodyPix(convexHull(points), img.width, img.height);
    saveJSON(points, "bodyPix_"+portraits_data[idx][0]);
}

function getMaskPolygon(mask) {
    let points = [];
    
    let n = 20;
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
    
    return points;
}

function pointInMask(mask, x, y) {
    let col = mask.get(x, y);
    return col[3] > 0;
}

// FACE-API

function faceApiResults(err, result) {
    if (err) {
        console.log(err);
        return;
    }
    let detections = {
        steersLeft: steeringLeft(result),
        leftEye: normalizeFaceApi(result.parts.leftEye, img.width, img.height),
        rightEye: normalizeFaceApi(result.parts.rightEye, img.width, img.height),
        mouth: normalizeFaceApi(result.parts.mouth, img.width, img.height)
    };
    console.log(detections);
    saveJSON(detections, "faceApi_"+portraits_data[idx][0]);
}