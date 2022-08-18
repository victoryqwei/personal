function drawCircle(x, y, r, o) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'grey';
    ctx.globalAlpha = o || 0.5;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    //ctx.stroke();
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