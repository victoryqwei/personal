class Game {
	constructor() {
		this.money = 1000;

		this.mapSize = 15;

		this.network = new Network();

		this.buses = [];
		this.stations = {};
		this.passengers = {};
		this.passengerTick = Date.now();
		this.passengerCooldown = 100;

		this.generate();
	}

	generate() { // Generate map
		this.buses = [];
		this.stations = {};
		this.network = new Network();

		// Generate stations
		for (let i = 0; i < 30; i++) {
			let tries = 10;
			for (let j = 0; j < tries; j++) {
				let randX = getRandomInt(-this.mapSize, this.mapSize);
				let randY = getRandomInt(-this.mapSize, this.mapSize);
				let randAngle = Math.PI/2 * getRandomInt(0, 3);

				let tooClose = false;
				for (let id in this.stations) {
					let station = this.stations[id];
					if (dist(station.pos, new Vector(randX, randY)) < 5) {
						tooClose = true;
						break;
					}
				}

				if (!tooClose) {
					let id = posToString(new Vector(randX, randY));
					this.stations[id] = new Station(randX, randY, randAngle);
					break;
				}
			}
		}

		// Generate passengers
		for (let i = 0; i < 10; i++) {
			this.addPassenger();
		}
	}

	addPassenger() {
		let startStation = randomProperty(this.stations);
		let destinationStation = randomProperty(this.stations);

		// Get destination station
		let found = false;
		let tries = 0;
		while (startStation.id == destinationStation.id && tries < 10) {
			destinationStation = randomProperty(this.stations);
			tries++;
		}

		let passengerId = randomString(8);

		startStation.queue.push(passengerId);
		this.passengers[passengerId] = new Passenger(passengerId, startStation, destinationStation);
	}

	addBus() {
        let nodePos = screenToNode(mouse, camera, zoom);
        let id = posToString(nodePos);

        if (stringExists(id, this.network.graph.nodes())) {
			this.buses.push(new Bus(nodePos.x, nodePos.y, id));
        }
	}

	update() {
		if (Date.now() - this.passengerTick > this.passengerCooldown) {
			this.passengerTick = Date.now();
			this.addPassenger();
		}
	}

	animate() {
		this.drawMapBorder();

		for (let id in this.stations) {
			let station = this.stations[id];
			station.animate();
		}

		this.network.animate();

		for (let bus of this.buses) {
			bus.update(this.network);
			bus.animate();
		}

		for (let id in this.passengers) {
			let passenger = this.passengers[id];
			passenger.update(this.network);
			passenger.animate();
		}
	}

	drawMapBorder() {
		let mapBorder = this.mapSize + 10;
		let p1 = nodeToScreen(new Vector(mapBorder, mapBorder), camera, zoom);
		let p2 = nodeToScreen(new Vector(-mapBorder, mapBorder), camera, zoom);
		let p3 = nodeToScreen(new Vector(-mapBorder, -mapBorder), camera, zoom);
		let p4 = nodeToScreen(new Vector(mapBorder, -mapBorder), camera, zoom);
		let p5 = nodeToScreen(new Vector(mapBorder, mapBorder), camera, zoom);

		drawLines(
			[p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y, p5.x, p5.y], 10*zoom, "black", 0.6
		)
	}
}