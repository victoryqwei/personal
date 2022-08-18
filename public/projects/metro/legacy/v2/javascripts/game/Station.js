class Station {
	constructor(x, y, angle) {
		this.pos = new Vector(x, y);
		this.id = posToString(this.pos);
		this.angle = angle || 0;

		this.color = "grey";
		this.passengerPerRow = 6; // Determines how many passengers can fit in a row

		this.currBus = undefined;
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
		
		this.updateCurrBus();

	}

	updateCurrBus() {
		if (!this.currBus)
			return;

		let bus = this.currBus;

		let availableSeats = bus.maxCapacity-bus.passengers.length;
		let idleTime =  Date.now() - bus.idleTime;
		if (availableSeats > 0 && idleTime < 1000) {
			this.startBoarding(bus)
		} else if (bus.inBus == bus.maxCapacity-availableSeats) { // Tell bus to leave after all passengers boarded (visually)
			let findNextNode = bus.nextNode();
			if (findNextNode) { // Successfully able to leave station, currBus is now undefined
				this.currBus = undefined;
			}
		}
	}

	startBoarding(bus) {
		this.currBus = bus;

		let availableSeats = bus.maxCapacity-bus.passengers.length;
		if (availableSeats > 0) { // Still have seats available on the bus
			// Move passengers from station to bus
			let boardingPassengers = this.queue.splice(0, availableSeats);
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

					passenger.queueIndex -= boardingPassengers.length;

					passenger.updateBoarding(bus);
				}
			}	
		}
	}

	leaveBus(bus) {
		for (let i = bus.passengers.length-1; i >= 0; i--) {
			let id = bus.passengers[i];
			let passenger  = game.passengers[id];
			if (passenger.destination == this.id) {
				passenger.leaveBus(bus);
				bus.passengers.splice(i, 1);
				bus.inBus -= 1;
			}
		}
	}
}