/*function drawCircle(x, y, r, o, c, b) {
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

function drawRectCenter(x, y, w, h, d, o) {
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
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke === 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}

function drawImage(img, x, y, w, h, angle) {
	ctx.translate(x, y);
	ctx.rotate(angle);
	ctx.drawImage(img, -w, -h, w*2, h*2);
	ctx.resetTransform();
}

function drawCircleImage(img, x, y, r, angle) {
	ctx.translate(x, y)
	ctx.rotate(angle);
	ctx.drawImage(img, -r, -r, r*2, r*2);
	ctx.resetTransform();
}
*/
/*function drawLine(x1, y1, x2, y2, thickness, color, alpha, cap) {
	ctx.beginPath();
	ctx.lineWidth = thickness || 1;
	ctx.strokeStyle = color || "black";
	ctx.globalAlpha = alpha || 1;
	ctx.lineCap = cap || "butt";
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	ctx.globalAlpha = 1;
	ctx.closePath();
}*/
/*
function drawText(text, x, y, font, color, align, baseline) {
	ctx.beginPath();
	ctx.font = font || "20px Arial";
	ctx.fillStyle = color || "red";
	ctx.textAlign = align || "default";
	ctx.textBaseline = baseline || "default";
	ctx.fillText(text, x, y);
	ctx.closePath();
}

function drawArrow(x1, y1, x2, y2, thickness, color, alpha, cap){
	ctx.beginPath();
	ctx.lineWidth = thickness || 2;
	ctx.strokeStyle = color || "black";
	ctx.globalAlpha = alpha || 1;
	ctx.lineCap = cap || "butt";
    var headlen = 10;   // length of head in pixels
    var angle = Math.atan2(y2-y1,x2-x1);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x2-headlen*Math.cos(angle-Math.PI/6),y2-headlen*Math.sin(angle-Math.PI/6));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2-headlen*Math.cos(angle+Math.PI/6),y2-headlen*Math.sin(angle+Math.PI/6));
    ctx.stroke();
    ctx.closePath();
    ctx.globalAlpha = 1;
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

function dist(a, b) {
	return Math.sqrt(Math.pow(a.x-b.x, 2) + Math.pow(a.y-b.y, 2));
}

function round(value, decimalPlace) {
	return Math.round( value * (10 ** (decimalPlace || 1)) ) / (10 ** (decimalPlace || 1))
}

function rad(deg) {
	return deg * Math.PI / 180;
}

function deg(rad) {
	return rad / Math.PI * 180;
}*/