function drawLine(x1, y1, x2, y2, thickness, color, alpha, cap) {
	ctx.beginPath();
	ctx.lineWidth = thickness || 1;
	ctx.strokeStyle = color || "black";
	ctx.globalAlpha = alpha || 1;
	ctx.lineCap = cap || "round";
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	ctx.closePath();
	ctx.globalAlpha = 1;
}

function drawLines(points, thickness, color, alpha, cap) {
  ctx.beginPath();
  ctx.lineWidth = thickness || 1;
  ctx.strokeStyle = color || "black";
  ctx.globalAlpha = alpha || 1;
  ctx.lineCap = cap || "round";
  ctx.moveTo(points[0], points[1]);
  for (let i = 2; i < points.length-1; i+=2) {
    ctx.lineTo(points[i], points[i+1]);
  }
  ctx.stroke();
  ctx.closePath();
  ctx.globalAlpha = 1;
}

function drawCircle(x, y, r, c, o, b) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = c || 'grey';
    ctx.globalAlpha = o;
    ctx.fill();
    ctx.globalAlpha = 1;
    if (b) {
    	ctx.lineWidth = 0.5;
	    ctx.strokeStyle = 'black';
	    ctx.stroke();
    }
    ctx.closePath();
}

function drawText(text, x, y, font, color, align, baseline) {
	ctx.beginPath();
	ctx.font = font || "20px Arial";
	ctx.fillStyle = color || "red";
	ctx.textAlign = align || "default";
	ctx.textBaseline = baseline || "default";
	ctx.fillText(text, x, y);
	ctx.closePath();
}

function drawRectCenter(x, y, w, h, d, o) {
	ctx.beginPath();
	ctx.translate(x, y)
	ctx.rotate(d);

	ctx.rect(-w/2, -h/2, w, h);
	ctx.fillStyle = o || 'grey';
	ctx.globalAlpha = 1;
	ctx.fill();
	ctx.beginPath();
	ctx.lineWidth = 4;
	ctx.strokeStyle = 'black';
	ctx.stroke();

	ctx.resetTransform();
	ctx.closePath();
}

function drawRect(x, y, w, h, c, options) {
  if (!options)
    options = {};

  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.rect(0, 0, w, h);
  ctx.fillStyle = c || 'black';
  ctx.globalAlpha = options.alpha || 1;
  if (options.fill == undefined || options.fill)
    ctx.fill();
  ctx.strokeStyle = options.outlineColor || "black";
  ctx.lineWidth = options.outlineWidth || 1;
  if (options.outline)
    ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

function drawArrow(x1, y1, x2, y2, thickness, color, alpha, cap, headlen){
  ctx.beginPath();
  ctx.lineWidth = thickness || 2;
  ctx.strokeStyle = color || "black";
  ctx.globalAlpha = alpha || 1;
  ctx.lineCap = cap || "butt";
  var headlen = headlen || 100;   // length of head in pixels
  var angle = Math.atan2(y2-y1,x2-x1);
  //ctx.lineTo(x2, y2);
  ctx.moveTo(x2-headlen*Math.cos(angle-Math.PI/6),y2-headlen*Math.sin(angle-Math.PI/6));

  ctx.lineTo(x2, y2);
  ctx.lineTo(x2-headlen*Math.cos(angle+Math.PI/6),y2-headlen*Math.sin(angle+Math.PI/6));
  ctx.stroke();
  ctx.closePath();
  ctx.globalAlpha = 1;
}

function drawTriangle(x, y, base, height, angle, color) {
   ctx.save();
   ctx.translate(x, y)
   ctx.rotate(angle);
    ctx.beginPath();
  
    var path =new Path2D();
    path.moveTo(-base/2,height/2);
    path.lineTo(0,-height/2);
    path.lineTo(base/2,height/2);
    path.lineTo(-base/2,height/2);
    path.lineTo(0,-height/2);
    ctx.miterLimit = 10;
    ctx.lineJoin = "miter";
    ctx.lineWidth = 7;
    ctx.fillStyle = color || "black";
    ctx.strokeStyle = color || "black";
    ctx.fill(path);

     ctx.closePath();
  ctx.resetTransform();
  ctx.restore();
}


// SMOOTH CURVE THROUGH N POINTS

function drawCurvedLines(ctx, pts) {
  ctx.moveTo(pts[0], pts[1]);
  for(i=0;i<pts.length;i+=1) ctx.lineTo(pts[i].x, pts[i].y);
}

function drawCurve(ctx, ptsa, tension, isClosed, numOfSegments, showPoints) {

	ctx.beginPath();

	let points = [];

	for(var i=0;i<ptsa.length;i+=1) {
		let node = nodeToScreen(ptsa[i], camera, zoom);
		points.push(node.x);
		points.push(node.y);
	}


	ctx.beginPath();

	ctx.lineWidth = 25*zoom;
	ctx.strokeStyle = "red";
	ctx.globalAlpha = 0.5;
	ctx.lineCap = "round";

	let curvePoints = getCurvePoints(points, tension, isClosed, numOfSegments);
	drawLines(ctx, curvePoints);

	ctx.stroke();

	return curvePoints;
}


function getCurvePoints(pts, tension, isClosed, numOfSegments) {

  // use input value if provided, or use a default value	 
  tension = (typeof tension != 'undefined') ? tension : 0.5;
  isClosed = isClosed ? isClosed : false;
  numOfSegments = numOfSegments ? numOfSegments : 16;

  var _pts = [], res = [],	// clone array
      x, y,			// our x,y coords
      t1x, t2x, t1y, t2y,	// tension vectors
      c1, c2, c3, c4,		// cardinal points
      st, t, i;		// steps based on num. of segments

  // clone array so we don't change the original
  //
  _pts = pts.slice(0);

  // The algorithm require a previous and next point to the actual point array.
  // Check if we will draw closed or open curve.
  // If closed, copy end points to beginning and first points to end
  // If open, duplicate first points to befinning, end points to end
  if (isClosed) {
    _pts.unshift(pts[pts.length - 1]);
    _pts.unshift(pts[pts.length - 2]);
    _pts.unshift(pts[pts.length - 1]);
    _pts.unshift(pts[pts.length - 2]);
    _pts.push(pts[0]);
    _pts.push(pts[1]);
  }
  else {
    _pts.unshift(pts[1]);	//copy 1. point and insert at beginning
    _pts.unshift(pts[0]);
    _pts.push(pts[pts.length - 2]);	//copy last point and append
    _pts.push(pts[pts.length - 1]);
  }

  // ok, lets start..

  // 1. loop goes through point array
  // 2. loop goes through each segment between the 2 pts + 1e point before and after
  for (i=2; i < (_pts.length - 4); i+=2) {
    for (t=0; t <= numOfSegments; t++) {

      // calc tension vectors
      t1x = (_pts[i+2] - _pts[i-2]) * tension;
      t2x = (_pts[i+4] - _pts[i]) * tension;

      t1y = (_pts[i+3] - _pts[i-1]) * tension;
      t2y = (_pts[i+5] - _pts[i+1]) * tension;

      // calc step
      st = t / numOfSegments;

      // calc cardinals
      c1 =   2 * Math.pow(st, 3) 	- 3 * Math.pow(st, 2) + 1; 
      c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
      c3 = 	   Math.pow(st, 3)	- 2 * Math.pow(st, 2) + st; 
      c4 = 	   Math.pow(st, 3)	- 	  Math.pow(st, 2);

      // calc x and y cords with common control vectors
      x = c1 * _pts[i]	+ c2 * _pts[i+2] + c3 * t1x + c4 * t2x;
      y = c1 * _pts[i+1]	+ c2 * _pts[i+3] + c3 * t1y + c4 * t2y;

      //store points in array
      res.push({x: x, y: y})

    }
  }

  return res;
}

// MATH FUNCTIONS

function round(value, decimalPlace) {
	return Math.round( value * (10 ** (decimalPlace || 1)) ) / (10 ** (decimalPlace || 1))
}

function dist(a, b) {
	return Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2));
}

function calculateAverage(array) {
    return array.reduce((a, b) => a + b) / array.length;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

// STRING FUNCTIONS

function randomString(length) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'.split('');

  if (! length) {
      length = Math.floor(Math.random() * chars.length);
  }

  var str = '';
  for (var i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

// OBJECT FUNCTIONS

var randomProperty = function (obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
};

// COLLISION FUNCTIONS

// LINE/RECTANGLE
function lineRect(x1, y1, x2, y2, rx, ry, rw, rh) {

  // check if the line has hit any of the rectangle's sides
  // uses the Line/Line function below
  var left =   lineLine(x1,y1,x2,y2, rx,ry,rx, ry+rh);
  var right =  lineLine(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh);
  var top =    lineLine(x1,y1,x2,y2, rx,ry, rx+rw,ry);
  var bottom = lineLine(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh);

  // if ANY of the above are true, the line
  // has hit the rectangle
  if (left || right || top || bottom) {
    return true;
  }
  return false;
}


// LINE/LINE
function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {

  // calculate the direction of the lines
  var uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  var uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

    return true;
  }
  return false;
}

function pDistance(x, y, x1, y1, x2, y2) {

  var A = x - x1;
  var B = y - y1;
  var C = x2 - x1;
  var D = y2 - y1;

  var dot = A * C + B * D;
  var len_sq = C * C + D * D;
  var param = -1;
  if (len_sq != 0) //in case of 0 length line
      param = dot / len_sq;

  var xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  }
  else if (param > 1) {
    xx = x2;
    yy = y2;
  }
  else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  var dx = x - xx;
  var dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

function lineOverlap(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {

var s1_x, s1_y, s2_x, s2_y;
s1_x = p1_x - p0_x;
s1_y = p1_y - p0_y;
s2_x = p3_x - p2_x;
s2_y = p3_y - p2_y;

var s, t;
s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

m1 = s1_y/s1_x; 
m2 = s2_y/s2_x;

//If they have the same slope check for the points to intersect
if(m1 == m2)
    return ((p0_x - p2_x)*(p0_y - p3_y) - (p0_x - p3_x)*(p0_y - p2_y) == 0 || (p1_x - p2_x)*(p1_y - p3_y) - (p1_x - p3_x)*(p1_y - p2_y) == 0);

return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
}
