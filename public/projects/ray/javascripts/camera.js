class Camera {
	constructor(fov) {
		this.pos = new Vector(map.width/2, map.height/2);
		this.rays = [];
		this.intersects = [];
		this.heading = 0;
		this.speed = 0.01;
		this.forwardSpeed = 1;
		this.radius = 4;

		// Add rays
		this.fov = fov;
		this.updateFOV(fov);
	}

	updateFOV(fov) {
		this.fov = fov || this.fov;
		this.rays = [];

		const step = this.fov*pixelDensity;
		for (let a = -this.fov/2; a < this.fov/2; a += step) {
			var ray = new Ray(this.pos, radians(a) + this.heading, radians(a));
			this.rays.push(ray);
		}
	}

	rotate(angle) {
		this.heading += angle;
		let index = 0;
		const step = this.fov*pixelDensity;
		for (let a = -this.fov/2; a < this.fov/2; a += step) {
			this.rays[index].setAngle(radians(a) + this.heading, radians(a));
			index++;
		}
	}

	update(x, y) {
		this.pos = new Vector(x, y);
	}

	move(keys) {
		// Move particle
		for (var i = 0; i < keys.length; i++) {
			var direction = new Vector();
			
			if (keys[65]) { // Left
				direction.x = 1;
			}
			if (keys[68]) { // Right
				direction.x = -1;
			}

			if (keys[87]) { // Forward
				direction.y = 1;
			} else if (keys[83]) { // Backward
				direction.y = -1;
			}

			if (keys[16]) {
				this.forwardSpeed = 2;
			} else {
				this.forwardSpeed = 1;
			}

			direction.normalize();

			var heading = this.rays[Math.floor(this.rays.length/2)].dir.copy();
			heading.normalize();
			if (direction.y > 0) {
				heading.mult(direction.y*this.speed*this.forwardSpeed);
			} else {
				heading.mult(direction.y*this.speed);
			}
			
			this.pos.add(heading)
			var heading = this.rays[Math.floor(this.rays.length/2)].dir.copy().rotate(90);
			heading.normalize();
			heading.mult(direction.x*this.speed);
			this.pos.add(heading)
		}
	}

	look(walls, rel) {
		const display = [];
		this.intersects = [];

		var playersHit = [];

		for (let i = 0; i < this.rays.length; i++)
		{
			const ray = this.rays[i]; // Get the current ray

			var intersections = []; // Stores all intersections with the ray
			for (let wall of walls) { // Intersect all boundaries
				var intersects = ray.cast(wall);
				if (intersects) {
					var distance = dist(this.pos, intersects);

					intersections.push({
						distance: distance,
						intersects: intersects,
						type: wall.type,
						id: wall.id
					})
				}
			}

			intersections.sort(function (a, b) { // Sort intersections based on closest to farthest distance
				return a.distance-b.distance;
			})

			if (!intersections.length) { // No intersections, go back to default
				intersections.push({
					distance: Infinity,
					intersects: {
						x: Infinity,
						y: Infinity
					}
				})
			}

			// Determine rasterization
			display[i] = [];
			var wallSeen = false;
			for (let j = 0; j < intersections.length; j++) { // Farthest to closest
				var pixelData = {
					distance: intersections[j].distance * Math.cos(ray.angleFromCenter),
					type: intersections[j].type,
					height: 0
				}
				if (intersections[j].type == "wall" && !wallSeen) {
					pixelData.height = 1;
				} else if (intersections[j].type == "player") {
					pixelData.height = 0.7;
				}
				if (j > 0 && intersections[j].type == "wall") {
					display[i].unshift(pixelData)
				} else if (j == 0) {
					display[i].unshift(pixelData)
				}

				if (intersections[j].type == "wall") {
					wallSeen = true;
				}
			}

			// Determine hit on player
			if (intersections[0].type == "player" && i == Math.floor(this.rays.length/2) && shoot) {
				playersHit.push(intersections[0].id);
			}

			// To the minimap
			this.intersects.push(new Vector(intersections[0].intersects.x, intersections[0].intersects.y));
		}

		// Deal damage to hit players

		for (let i = 0; i < players.length; i++) {
			if (players[i]) {
				if ($.inArray(players[i].id, playersHit) >= 0) {
					players[i].hp -= 10;
				}

				if (players[i].hp < 0) {
					// Remove all boundaries of player
					for (var j = walls.length - 1; j >= 0; j--) {
						if (walls[j].id == players[i].id) {
							walls[j].dead = true;
						}
					}
					players[i].dead = true; // Remove player
				}
			}
		}

		shoot = false;

		return display;
	}

	show(rel) {
		// Draw rays on minimap
		for (let i = 0; i < this.intersects.length; i++) {
			ctx.strokeStyle = "yellow";
			if (i == Math.floor(this.intersects.length/2)) {
				ctx.strokeStyle = "red";
			}
			drawLine(this.pos.x*rel.width, this.pos.y*rel.height, this.intersects[i].x*rel.width, this.intersects[i].y*rel.height, 1, 0.5);
		}
		drawCircle(this.pos.x*rel.width, this.pos.y*rel.height, this.radius, "#00AEFF");

		// Dead
		if (dead) {
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = "red";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.globalAlpha = 1;

			ctx.fillStyle = "white";
			ctx.textAlign = "center";
			ctx.font = "80px Arial";
			ctx.fillText("You Died", canvas.width/2, canvas.height/3);
			ctx.textAlign = "left";
		}
	}
}