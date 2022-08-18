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

		this.path = []; // Stations required to get the destination

		this.currStation = startStation;
		this.currBus = undefined;
		this.inBus = false;
		this.boarding = false;
		this.arrived = false;
		this.busColor = undefined;

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
		let queueIndex = undefined;
		for (let i = 0; i < station.queue.length; i++) {
			if (station.queue[i] == this.id) {
				queueIndex = (station.queue.length-1)-i;
				break;
			}

		}

		this.targetPos = this.getSpawnPos(station, queueIndex);

		if (spawnNewPos) {
			
			this.pos = this.getSpawnPos(station);
			this.spawnPos = this.pos.copy();
		}

		
	}

	getPathToNextStation() {

		let path = [this.start];

		this.path = game.network.graph.shortestPath(this.start, this.destination);

		if (this.path.length > 0) {
			// Get next station
			for (let i = 1; i < this.path.length; i++) {
				let id = this.path[i];
				if (game.stations[id] != undefined)
					return this.path.slice(0, i+1);
			}
		}
			
	}

	getBusColor(bus) {
		let path = this.getPathToNextStation();
		if (!path)
			return;

		if (bus) {
			let workingPath = game.network.lines[bus.color].graph.shortestPath(path[0], path[path.length-1]).length > 0;
			if (workingPath) {
				this.busColor = bus.color;
				return bus.color;
			}
		}

		for (let color in game.network.lines) {
			let workingPath = game.network.lines[color].graph.shortestPath(path[0], path[path.length-1]).length > 0;
			if (workingPath) {
				this.busColor = color;
				return color;
			}
		}

		// Still don't know how to get to the next station, because there's a fork in the road


	}

	leaveBus(bus, stationPos, index) {
		this.start = stationPos;
		this.currBus = undefined;
		this.currStation = game.stations[stationPos];
		this.inBus = false;
		this.targetPos = this.getSpawnPos(game.stations[stationPos], index);
		this.pos = stringToPos(stationPos);

		if (stationPos == this.destination) {
			this.arrived = true;
		}
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

	transferBus(bus) {
		let currPos = bus.start;
		this.currStation = game.stations[currPos];
		this.start = currPos;

		if (this.path.length > 0) {

			// Clear previous path
			for (let i = 0; i < this.path.length; i++) {
				let path = this.path[i];
				if (path == currPos) {
					this.path.splice(0, i);
					break;
				}
			}

			// Check if need for bus change
			let needTransfer = false;
			if (this.getBusColor() != bus.color) {
				needTransfer = true;
			}

			if (needTransfer) {
				this.currBus = undefined;
				this.inBus = false;
				this.currStation.queue.unshift(this.id);
				this.spawn();
				this.pos = stringToPos(currPos);

				return true; // Get off current bus and wait for next bus at current station
			}
			
		}
	}

	update(network) {
		this.path = game.network.graph.shortestPath(this.start, this.destination); // MAYBE ONLY UPDATE WHEN NETWORK CHANGES?
		
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

		/*let start = nodeToScreen(stringToPos(this.start), camera, zoom);
		let destination = nodeToScreen(stringToPos(this.destination), camera, zoom);
		drawCircle(start.x, start.y, 15*zoom, "lime");
		drawCircle(destination.x, destination.y, 15*zoom, "red");*/

		if (this.inBus) // Don't draw passengers on bus
			return;

		let screen = nodeToScreen(this.pos, camera, zoom);
		let color = this.path.length > 0 ? "black" : "red"; // Check if passenger has path
		drawCircle(screen.x, screen.y, 5*zoom, color, this.alpha);
	}
}