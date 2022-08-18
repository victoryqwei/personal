// Point
class Point {
	constructor(x, y) {

	}
}

// Line segment
class Boundary {
	constructor(a, b, c, d, type = "wall", id) {
		if (c == undefined || d == undefined) { // Given point
			this.a = a;
			this.b = b;
		} else {
			this.a = new Vector(a, b);
			this.b = new Vector(c, d);
		}

		this.type = type;
		this.id = id;
	}

	update(a, b, c, d) {
		if (c == undefined || d == undefined) { // Given point
			this.a = a;
			this.b = b;
		} else {
			this.a = new Vector(a, b);
			this.b = new Vector(c, d);
		}
	}

	show(rel) {
		ctx.strokeStyle = "green";
		drawLine(this.a.x*rel.width, this.a.y*rel.height, this.b.x*rel.width, this.b.y*rel.height)
	}
}

// Rectangle
class Rectangle {
	constructor(a, b, c, d, type, id) {
		if (c == undefined || d == undefined) { // Given point
			this.a = a;
			this.b = b;
		} else {
			this.a = new Vector(a, b);
			this.b = new Vector(c, d);
		}

		// Convert into boundaries
		this.boundaries = [
			new Boundary(this.a.x, this.a.y, this.b.x, this.a.y, type, id), // Top boundary
			new Boundary(this.b.x, this.a.y, this.b.x, this.b.y, type, id), // Right boundary
			new Boundary(this.b.x, this.b.y, this.a.x, this.b.y, type, id), // Bottom boundary
			new Boundary(this.a.x, this.a.y, this.a.x, this.b.y, type, id) // Left boundary
		];

		for (let i = 0; i < this.boundaries.length; i++) {
			walls.push(this.boundaries[i]);
		}

		return this;
	}

	update(a, b, c, d) {
		if (c == undefined || d == undefined) { // Given point
			this.a = a;
			this.b = b;
		} else {
			this.a = new Vector(a, b);
			this.b = new Vector(c, d);
		}

		this.boundaries[0].update(this.a.x, this.a.y, this.b.x, this.a.y);
		this.boundaries[1].update(this.b.x, this.a.y, this.b.x, this.b.y);
		this.boundaries[2].update(this.b.x, this.b.y, this.a.x, this.b.y);
		this.boundaries[3].update(this.a.x, this.a.y, this.a.x, this.b.y);
	}

	show(rel) { // Unused at the moment
		ctx.strokeStyle = "red";

		var x1 = this.a.x*rel.width;
		var y1 = this.a.y*rel.height;
		var x2 = (this.b.x-this.a.x)*rel.width;
		var y2 = (this.b.y-this.a.y)*rel.height;

		drawLine(x1, y1, x2, y1);
		drawLine(x2, y1, x2, y2);
		drawLine(x2, y2, x1, y2);
		drawLine(x1, y2, x1, y1);
	}
}