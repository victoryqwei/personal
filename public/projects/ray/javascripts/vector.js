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

Vector.prototype.rotate = function(ang)
{
    ang = -ang * (Math.PI/180);
    var cos = Math.cos(ang);
    var sin = Math.sin(ang);
    return new Vector(Math.round(10000*(this.x * cos - this.y * sin))/10000, Math.round(10000*(this.x * sin + this.y * cos))/10000);
};

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