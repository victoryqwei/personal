class Ray {
	constructor(pos, angle)
	{
		this.pos = pos;
		this.dir = new Vector(Math.sin(angle), Math.cos(angle));
		this.angleFromCenter = 0;
	}

	setAngle(angle, angleFromCenter = 0) {
		this.dir = new Vector(Math.sin(angle), Math.cos(angle));
		this.angleFromCenter = angleFromCenter;
	}

	show() {
		ctx.strokeStyle = "white";
		drawLine(this.pos.x, this.pos.y, this.pos.x+this.dir.x, this.pos.y+this.dir.y);
	}

	cast(wall) {
		const x1 = wall.a.x;
		const y1 = wall.a.y;
		const x2 = wall.b.x;
		const y2 = wall.b.y;

		const x3 = this.pos.x;
		const y3 = this.pos.y;
		const x4 = this.pos.x + this.dir.x;
		const y4 = this.pos.y + this.dir.y;

		const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if (den == 0) {
			return;
		}

		const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
		const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

		if (t > 0 && t < 1 && u > 0) {
			const intersection = new Vector();
			intersection.x = x1 + t * (x2 - x1);
			intersection.y = y1 + t * (y2 - y1);
			return intersection;
		}
	}
}