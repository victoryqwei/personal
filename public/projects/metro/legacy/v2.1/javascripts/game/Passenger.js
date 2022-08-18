class Passenger {
	constructor(id, startStation, destinationStation) {
		this.id = id;

		this.pos = new Vector();
		this.targetPos = new Vector();
		this.spawnPos = new Vector();

		this.speed = 5;

		this.alpha = 0;

		this.start = startStation.id;
		this.destination = destinationStation.id;

		this.path = []; // Station required to get the destination

		this.currStation = startStation;
		this.currBus = undefined;
		this.inBus = false;
		this.boarding = false;
		this.arrived = false;

		this.spawn(true);
	}

	getSpawnPos(station, index) {
		// Get waiting position (at queue position 0)
		let targetX = station.pos.x + 0.75*Math.sin(station.angle) + 1.25*Math.cos(station.angle);
		let targetY = station.pos.y - 0.75*Math.cos(station.angle) + 1.25*Math.sin(station.angle);

		if (index != undefined) {
			// Get waiting position of queueIndex
			targetX += -0.5*Math.cos(station.angle)*(index%station.passengerPerRow);
			targetY += -0.5*Math.sin(station.angle)*(index%station.passengerPerRow);

			let rowNumber = Math.floor(index/station.passengerPerRow);

			targetX += 0.5*Math.sin(station.angle)*rowNumber;
			targetY += -0.5*Math.cos(station.angle)*rowNumber;
		} else {
			// Get spawn position
			targetX += 4*Math.sin(station.angle) + getRandomFloat(-1.5, 1.5);
			targetY += - 4*Math.cos(station.angle) + getRandomFloat(-1.5, 1.5);
		}

		return new Vector(targetX, targetY);
	}

	spawn(spawnNewPos) {
		// Queue index waiting line
		let station = this.currStation;

		// Queue index waiting line
		if (!this.queueIndex) {
			this.queueIndex = station.queue.length;
		}

		let index = this.queueIndex-1;

		this.targetPos = this.getSpawnPos(station, index);

		if (spawnNewPos) {
			
			this.pos = this.getSpawnPos(station);
			this.spawnPos = this.pos.copy();
		}
		
	}

	leaveBus(bus) {
		this.inBus = false;
		this.targetPos = this.getSpawnPos(game.stations[this.destination]);
		this.pos = stringToPos(this.destination);

		this.arrived = true;
	}

	updateBoarding(bus, boarding) {
		this.boarding = boarding;

		if (this.boarding) { // Move to bus
			this.targetPos = stringToPos(this.start);
			this.currBus = bus;
			this.currStation = undefined;
		} else { // Move forward in waiting line
			this.spawn();
		}
	}

	update(network) {
		
		// Move towards target (waiting) position
		let dir = Vector.sub(this.targetPos, this.pos);
		if (dir.getMag() > 0.05) { // May cause jiggling in slower computers
			dir.normalize();
			dir.mult(delta/1000*this.speed);

			this.pos.add(dir);
			
			if (this.arrived) {
				this.alpha = Math.max(0, this.alpha - delta/1000 / 3 * this.speed)
			} else {
				this.alpha = Math.min(0.8, this.alpha + delta/1000 * this.speed)
			}
		} else { // Arrived at target position
			this.pos = this.targetPos.copy();

			if (this.boarding) {
				this.currBus.inBus += 1; // Used for animation purposes
				this.inBus = true;
				this.boarding = false;
			}

			if (this.arrived) {
				delete game.passengers[this.id];
			}

			this.alpha = Math.min(0.8, this.alpha + delta/1000 * this.speed)
		}
		
	}

	animate() {
		if (this.inBus) // Don't draw passengers on bus
			return;

		let screen = nodeToScreen(this.pos, camera, zoom);
		drawCircle(screen.x, screen.y, 5*zoom, "black", this.alpha);
	}
}