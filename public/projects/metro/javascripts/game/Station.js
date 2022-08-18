class Station {
	constructor(x, y, angle) {
		this.pos = new Vector(x, y);
		this.id = posToString(this.pos);
		this.angle = angle || 0;

		this.color = "grey";
		this.passengerPerRow = 6; // Determines how many passengers can fit in a row

		this.buses = [];
		this.queue = [];
	}

	animate() {
		this.update();

		ctx.save();

		let screen = nodeToScreen(this.pos, camera, zoom);
		let screenBlockSize = gridBlockSize*zoom;

		if (inScreen(screen, screenBlockSize*2)) {
			let color = this.collision ? "red" : this.color;

			ctx.translate(screen.x, screen.y);
			ctx.rotate(this.angle);

			drawLines(
				[-screenBlockSize*3/2, -screenBlockSize*3/2, -screenBlockSize*3/2, -screenBlockSize/2, screenBlockSize*3/2, -screenBlockSize/2, screenBlockSize*3/2, -screenBlockSize*3/2], 5*zoom, color, 0.5, "butt"
			)

			drawCircle(0, 0, zoom*15, color, 0.5);

			ctx.restore();

			this.collision = false;
		}
	}

	update() {
		
		this.updateBuses();

	}

	updateBuses() {
		for (let i = this.buses.length - 1; i >= 0; i--) {
			let bus = this.buses[i];
			if (!bus)
				continue;

			let availableSeats = bus.maxCapacity-bus.passengers.length;
			let idleTime =  Date.now() - bus.idleTime;
			if (availableSeats > 0 && idleTime < 1000) {
				//this.boardBus(bus)
			} else if (bus.inBus == bus.maxCapacity-availableSeats) { // Tell bus to leave after all passengers boarded (visually)
				let findNextNode = bus.nextNode();
				if (findNextNode) { // Successfully able to leave station, buses is now undefined
					this.buses.splice(i, 1);
					continue;
				}
			}
		}	
	}

	boardBus(bus) {
		let exists = false;
		for (let b of this.buses) {
			if (bus.id == b.id) {
				exists = true;
				continue;
			}
		}
		if (!exists) {
			this.buses.push(bus);
		}

		let availableSeats = bus.maxCapacity-bus.passengers.length;
		if (availableSeats > 0) { // Still have seats available on the bus
			// Move passengers from station to bus
			let boardingPassengers = [];

			// Set passenger color preference
			for (let id in game.passengers) {
				let passenger = game.passengers[id];
				if (passenger.busColor == undefined)
					passenger.getBusColor(bus);
			}

			// Check for passenger color preference
			for (let i = this.queue.length-1; i>=0; i--) {
				let passengerId = this.queue[i];
				let passenger = game.passengers[passengerId];
				if (boardingPassengers.length < availableSeats) {
					// Check passenger has path to destination and is going on the correctly colored bus
					if ((passenger.busColor == bus.color/* || passenger.busColor == undefined*/) && passenger.path.length > 0) {
						boardingPassengers.push(passengerId);
						this.queue.splice(i, 1);
					}
				} else {
					break;
				}
			}

			let lenBoardingPassengers = boardingPassengers.length;
			if (lenBoardingPassengers > 0) {
				// Move passengers from station to bus
				for (let id of boardingPassengers) {
					let passenger = game.passengers[id];

					passenger.updateBoarding(bus, true); // Board the bus
				}

				bus.passengers = bus.passengers.concat(boardingPassengers); // Update passengers in bus
				bus.idleTime = Date.now();

				// Move waiting passengers to the next place in line
				for (let id of this.queue) {
					let passenger = game.passengers[id];

					passenger.updateBoarding(bus);
				}
			}	
		}
	}

	leaveBus(bus) {
		for (let i = bus.passengers.length-1; i >= 0; i--) {
			let id = bus.passengers[i];
			let passenger  = game.passengers[id];
			if (passenger.destination == this.id) { // At destination
				passenger.leaveBus(bus, this.id);
				bus.passengers.splice(i, 1);
				bus.inBus -= 1;
			} else { 
				if (passenger.transferBus(bus)) {
					bus.passengers.splice(i, 1);
					bus.inBus -= 1;
				}
				
			}
		}
	}
}