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
    for (let item of vertices) {
        let r = dist(cx, cy, item[0], item[1]);
        if (r > maxRad) maxRad = r;
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

function normalizeBodyPix(vertices, w, h) {
    let newVertices = [];
    vertices.forEach(item => {
        newVertices.push([item[0]/w, item[1]/h]);
    })
    return newVertices;
}

function normalizeFaceApi(vertices, w, h) {
    let newVertices = [];
    vertices.forEach(item => {
        newVertices.push([item._x/w, item._y/h]);
    })
    return newVertices;
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