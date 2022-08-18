class Bus {
    constructor(x, y, start) {
        this.id = randomString(8);

        this.pos = new Vector(x, y);
        this.vel = new Vector();
        this.angle = 0;
        this.t = Date.now();
        this.speed = 20;

        this.start = start;
        this.destination = undefined;

        this.path = [];
        this.split = {}; // Split paths

        this.passengers = []; // Current passengers on bus
        this.maxCapacity = 5;

        this.inBus = 0; // Animated passengers on bus (animation purposes)
        this.idleTime = Date.now(); // How long the bus is idling at the station (without new people boarding)

        this.checkStationArrival();
    }

    animate() {
        let screen = nodeToScreen(this.pos, camera, zoom);

        let bodyLength = 50;
        let dir = new Vector(Math.cos(this.angle), Math.sin(this.angle));
        dir.mult(5*zoom);

        drawRectCenter(screen.x, screen.y, bodyLength*zoom, 30*zoom, this.angle, "green")
        drawArrow(screen.x, screen.y, screen.x+dir.x, screen.y+dir.y, 5*zoom, "white", 1, "square", 10*zoom)
    }

    move() {
        if (this.path.length > 1) {

            let p1 = stringToPos(this.path[0]);
            let p2 = stringToPos(this.path[1]);
            let dir = Vector.sub(p2, p1);
            let d = dir.getMag();

            if (Vector.sub(this.pos, p1).getMag() > d) {
                this.path.shift();
                this.pos = p2;

                this.start = this.path[1];
                if (this.path.length <= 1) {
                    this.start = this.path[0] // Arrived at destination
                    this.checkStationArrival();
                }
            } else {
                // Going to next node
                dir.normalize();
                dir.mult(delta/1000*this.speed);
                this.pos.add(dir);

                this.angle = Math.atan2(dir.y, dir.x);
            }
        } else {
            let station = game.stations[this.start];
            if (!station) { // Hasn't arrived at station yet
                this.nextNode();
            } else {
                //console.log(station.queue);
            }
        }
    }

    checkStationArrival() {
        let station = game.stations[this.start];
        if (!station) { 
            this.nextNode(); // Hasn't arrived at station yet
        } else {
            station.leaveBus(this); // Let passengers leave from the bus first
            station.boardBus(this); // Start boarding process for passengers
        }
    }

    nextNode() {
        let network = game.network;
        
        // Auto move bus
        let adjNodes = network.graph.adjacent(this.start);
        if (adjNodes.length == 1) {
            
            this.path = [this.start, adjNodes[0]]
            return true;
        } else if (adjNodes.length > 1) {
            // Choose unvisited nodes first

            if (this.split[this.start] && this.split[this.start].length > 0) {
                this.path = [this.start, this.split[this.start][0]]
                this.split[this.start].shift();
            } else {
                let nodes = [];
                for (let node of adjNodes) {
                    nodes.push(node);
                }
                this.split[this.start] = nodes;

                this.path = [this.start, this.split[this.start][0]]
                this.split[this.start].shift();
            }
            return true;
        } else {
            return false; // Unable to find next node
        }
    }

    update(network) {

        // Move bus
        this.move();

        

    }
}