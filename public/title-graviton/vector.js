var Vector = function (x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

Vector.prototype.getMag = function () {
	return Math.sqrt(this.x*this.x + this.y*this.y);
}

Vector.prototype.add = function (b) {
	this.x = this.x + b.x;
	this.y = this.y + b.y
}

Vector.prototype.sub = function (b) {
	this.x = this.x - b.x;
	this.y = this.y - b.y
}

Vector.prototype.mult = function (scalar) {
	this.x = this.x * scalar;
	this.y = this.y * scalar;
}

Vector.prototype.div = function (scalar) {
	this.x = this.x / scalar;
	this.y = this.y / scalar;
}

Vector.prototype.getDot = function (b) {
	return new Vector(this.x * b.x, this.y * b.y);
}

Vector.prototype.normalize = function () {
	if (this.getMag() != 0) {
		this.div(this.getMag());
	}
}

Vector.prototype.limit = function (max) {
	if (this.getMag() > max) {
		this.normalize();
		this.mult(max);
	}
}

Vector.prototype.copy = function () {
	return new Vector(this.x, this.y);
}