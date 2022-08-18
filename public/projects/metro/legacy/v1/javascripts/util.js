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

function drawCircle(x, y, r, c, o, b) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = c || 'grey';
    ctx.globalAlpha = o || 1;
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
	ctx.lineWidth = 0.5;
	ctx.strokeStyle = 'black';
	ctx.stroke();

	ctx.resetTransform();
	ctx.closePath();
}


// SMOOTH CURVE THROUGH N POINTS

function drawLines(ctx, pts) {
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