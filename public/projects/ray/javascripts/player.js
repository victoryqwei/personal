class Player {
	constructor() {
		this.id = createId(16);

		this.pos = new Vector(randomInt(0, map.width), randomInt(0, map.height));
		this.size = 8;

		this.box = new Rectangle(this.pos.x-this.size, this.pos.y-this.size, this.pos.x+this.size, this.pos.y+this.size, "player", this.id);

		this.hp = 5;
		this.dead = false;

		
	}

	show(rel) {
		drawCircle(this.pos.x*rel.width, this.pos.y*rel.height, this.size/2, "red");
	}

	move() {
		var direction = camera.pos.copy();
		direction.sub(this.pos);
		direction.normalize();
		direction.mult(0.5);
		this.pos.add(direction);
		this.box.update(this.pos.x-this.size, this.pos.y-this.size, this.pos.x+this.size, this.pos.y+this.size);
	}
}