function drawCircle(x, y, r, o) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.globalAlpha = o || 0.2;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
}

function drawRect(x, y, w, h, d, o) {
  ctx.translate(x, y)
  ctx.rotate(d);
  
	ctx.rect(-w/2, -h/2, w, h);
  ctx.fillStyle = 'grey';
  ctx.globalAlpha = 0.4;
  ctx.fill();
  ctx.beginPath();
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  
  ctx.resetTransform();
  
}

function drawTriangle(x, y, l, d, c, o) {
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.rotate(d);
  ctx.fillStyle = c ||"grey";
  ctx.globalAlpha = o || 0.8;
  ctx.moveTo(-l, -l/2);
  ctx.lineTo(-l, l/2);
  ctx.lineTo(l, 0);
  ctx.fill();
  
  ctx.resetTransform();
  ctx.closePath();
}

function drawLine() {
	mouse = new Vector(mouseX, mouseY);
	coord = new Vector(canvas.width/2, canvas.height/2);

	mouse.sub(coord);
	mouse.normalize();
	mouse.mult(100);

	ctx.beginPath();
	ctx.lineWidth = 2;
	ctx.moveTo(coord.x, coord.y);
	ctx.lineTo(mouse.x+coord.x, mouse.y+coord.y);
	ctx.stroke();
	ctx.closePath();

	// Get Magnitude
	ctx.fillText(mouse.getMag(), 10, 10)
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

function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function getNormalPoint(p, a, b) {
  var ap = new Vector().sub(p, a);
  var ab = new Vector().sub(b, a);
  ab.normalize();
  var dot = ap.getDot(ab);
  ab.mult(dot);
  
  var normalPoint = new Vector().add(a, ab);
  return normalPoint;
}

function radians(degrees) {
  return degrees / Math.PI * 180;
}