let seed;

let bodyPixBase;
let faceApiBase;
let faceApiLeftEye;
let faceApiRightEye;
let faceApiMouth;

let imgBase;
let imgLeftEye;
let imgRightEye;
let imgMouth;
let imgBackground;

let loadCount = 0;

const faceApiOptions = {
    withLandmarks: true,
    withDescriptors: false
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    seed = ~~random(1e9);
    console.log("Seed: "+seed);
    randomSeed(seed);

    shuffle(portraits_data, true);
    let baseId = portraits_data[0], leftEyeId = portraits_data[1], rightEyeId = portraits_data[2], mouthId = portraits_data[3];

    let backgroundId = random(backgrounds_data);

    imgBase = loadImage("portraits/"+baseId[0]+"."+baseId[1], () => {console.log("Base portrait: " + baseId[2] + ", " + baseId[3]); loadCount++});
    imgLeftEye = loadImage("portraits/"+leftEyeId[0]+"."+leftEyeId[1], () => {console.log("Left eye: " + leftEyeId[2] + ", " + leftEyeId[3]); loadCount++});
    imgRightEye = loadImage("portraits/"+rightEyeId[0]+"."+rightEyeId[1], () => {console.log("Right eye: " + rightEyeId[2] + ", " + rightEyeId[3]); loadCount++});
    imgMouth = loadImage("portraits/"+mouthId[0]+"."+mouthId[1], () => {console.log("Mouth: " + mouthId[2] + ", " + mouthId[3]); loadCount++});

    bodyPixBase = loadJSON("ml/bodyPix_"+baseId[0]+".json", () => loadCount++);
    faceApiBase = loadJSON("ml/faceApi_"+baseId[0]+".json", () => loadCount++);
    faceApiLeftEye = loadJSON("ml/faceApi_"+leftEyeId[0]+".json", () => loadCount++);
    faceApiRightEye = loadJSON("ml/faceApi_"+rightEyeId[0]+".json", () => loadCount++);
    faceApiMouth = loadJSON("ml/faceApi_"+mouthId[0]+".json", () => loadCount++);

    imgBackground = loadImage("backgrounds/"+backgroundId[0]+"."+backgroundId[1], () => {console.log("Background: " + backgroundId[2] + ", " + backgroundId[3]); loadCount++});
}

function draw() {
    background("seashell");
    frameRate(20);
    noStroke();
    fill(0);
    textAlign(CENTER, CENTER);
    textFont("Courier New", windowHeight/75);
    text("Loading...", width/2, height/2);

    if (loadCount == 10) {
        let ratio = imgBase.height/imgBase.width;
        let W = windowWidth*0.9, H = windowHeight*0.9;
        if (W*ratio < H) resizeCanvas(W, W*ratio);
        else resizeCanvas(H/ratio, H);
    
        pixelDensity(2);
        noLoop();
    
        if (imgBase.width < width) imgBase.resize(width, 0);
        if (imgBase.height < height) imgBase.resize(0, height);
        if (imgLeftEye.width < width) imgLeftEye.resize(width, 0);
        if (imgLeftEye.height < height) imgLeftEye.resize(0, height);
        if (imgRightEye.width < width) imgRightEye.resize(width, 0);
        if (imgRightEye.height < height) imgRightEye.resize(0, height);
        if (imgMouth.width < width) imgMouth.resize(width, 0);
        if (imgMouth.height < height) imgMouth.resize(0, height);
    
        imgBackground.resize(0, height);
    
        image(imgBackground, random(width-imgBackground.width), 0);
    
        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        drawingContext.shadowBlur = width/100;
        drawingContext.shadowColor = "#00000095";
    
        push();
        cutOutline();
        drawFacialFeatures();
        pop();

        let seedText = `seed=${seed}`;
        let h = windowHeight/125;
        textFont("Courier New", h);
        let w = textWidth(seedText), margin = textWidth(" ")*3/4;

        let p = createP(seedText);
        p.style("font-family", "Courier New");
        p.style("font-size", h);
        let wMargin = (windowWidth-width)/2;
        let hMargin = (windowHeight-height)/2
        p.position(wMargin + width - w, hMargin + height - h + margin/2);
    }
}

function keyPressed() {
    if (key == "r" || key == "a") {
        loadCount = 0;
        console.clear();
        removeElements();
        loop();
        setup();
    }
}

// BACKGROUND

function cutOutline() {
    let points = Object.entries(bodyPixBase);
    let img = imgBase.get();
    let myMask = createGraphics(img.width, img.height);
    myMask.fill(0);
    myMask.noStroke();
    myMask.beginShape();
    for (let item of points) {
        let x = item[1][0]*img.width;
        let y = item[1][1]*img.height;
        myMask.vertex(x, y);
    }
    myMask.endShape(CLOSE);
    img.mask(myMask);
    myMask.remove();

    translate(width/2, height/2);
    scale(0.95);
    rotate(random(-1, 1)*0.03);
    translate(-width/2, -height/2);

    image(img, 0, 0, width, height);
}

// PORTRAIT

function drawFacialFeatures() {
    if (random() < 1/2) {
        drawLeftEye();
        drawRightEye();
    } else {
        drawRightEye();
        drawLeftEye();
    }
    drawMouth();
}

function drawLeftEye() {
    let steersInCorrectWay = (faceApiLeftEye.steersLeft == faceApiBase.steersLeft);

    let vertices = steersInCorrectWay ? faceApiLeftEye.leftEye : faceApiLeftEye.rightEye;
    let [centroidLeftEye, radLeftEye, angleLeftEye] = analyzeShape(faceApiBase.leftEye);
    drawShape(vertices, imgLeftEye, centroidLeftEye, radLeftEye, angleLeftEye, 1.5, !steersInCorrectWay);
}

function drawRightEye() {
    let steersInCorrectWay = (faceApiRightEye.steersLeft == faceApiBase.steersLeft);

    let vertices = steersInCorrectWay ? faceApiRightEye.rightEye : faceApiRightEye.leftEye;
    let [centroidRightEye, radRightEye, angleRightEye] = analyzeShape(faceApiBase.rightEye);
    drawShape(vertices, imgRightEye, centroidRightEye, radRightEye, angleRightEye, 1.5, !steersInCorrectWay);
}

function drawMouth() {
    let steersInCorrectWay = (faceApiMouth.steersLeft == faceApiBase.steersLeft);

    let vertices = convexHull(faceApiMouth.mouth);
    let [centroidMouth, radMouth, angleMouth] = analyzeShape(convexHull(faceApiBase.mouth));
    drawShape(vertices, imgMouth, centroidMouth, radMouth, angleMouth, 0.5, !steersInCorrectWay);
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
        let x = centroid[0] + (r+border)*Math.cos(theta);
        let y = centroid[1] + (r+border)*Math.sin(theta);
        myMask.vertex(x*img.width, y*img.height);
    })
    myMask.endShape(CLOSE);
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
    image(img, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight);
    pop();
}