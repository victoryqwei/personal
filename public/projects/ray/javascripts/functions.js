function drawCircle(x, y, r, o) {
	ctx.beginPath();
	ctx.fillStyle = o || "grey";
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.lineWidth = 0.5;
    ctx.closePath();
}

function drawRect(x, y, w, h) {
	ctx.fillRect(x-w/2, y-h/2, w, h);
}

function drawLine(x1, y1, x2, y2, width = 2, opacity) {
	ctx.beginPath();
    ctx.globalAlpha = opacity || 1;
	ctx.lineWidth = width;
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
    ctx.globalAlpha = 1;
	ctx.closePath();
}

function dist(a, b) {
	return Math.sqrt(Math.pow(a.x-b.x, 2)+Math.pow(a.y-b.y, 2));
}

function constrain(value, a, b) {
	if (value < a) {
		return a;
	} else if (value > b) {
		return b;
	} else {
		return value
	}
}

function random(max, min) {
	return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
	if (max) {
		return Math.floor(Math.random() * max)-min;
	} else {
		return Math.floor(Math.random() * min);
	}
}

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function radians(degrees) {
	return degrees*Math.PI/180;
}

function collisionCircleLine(circle, line){
    var a, b, c, d, u1, u2, ret, retP1, retP2, v1, v2;
    v1 = {};
    v2 = {};
    v1.x = line.b.x - line.a.x;
    v1.y = line.b.y - line.a.y;
    v2.x = line.a.x - circle.pos.x;
    v2.y = line.a.y - circle.pos.y;
    b = (v1.x * v2.x + v1.y * v2.y);
    c = 2 * (v1.x * v1.x + v1.y * v1.y);
    b *= -2;
    d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
    if(isNaN(d)){ // no intercept
        return [];
    }
    u1 = (b - d) / c;  // these represent the unit distance of point one and two on the line
    u2 = (b + d) / c;    
    retP1 = {};   // return points
    retP2 = {}  
    ret = []; // return array
    if(u1 <= 1 && u1 >= 0){  // add point if on the line segment
        retP1.x = line.p1.x + v1.x * u1;
        retP1.y = line.p1.y + v1.y * u1;
        ret[0] = retP1;
    }
    if(u2 <= 1 && u2 >= 0){  // second add point if on the line segment
        retP2.x = line.p1.x + v1.x * u2;
        retP2.y = line.p1.y + v1.y * u2;
        ret[ret.length] = retP2;
    }       
    return ret;
}

function createId(length) {
    return Math.random().toString(length).slice(2);
}