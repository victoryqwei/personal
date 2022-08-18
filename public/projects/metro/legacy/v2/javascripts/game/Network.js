class Network {
    constructor() {

        this.graph = new Graph();

        this.edges = [];

        this.prevNode = undefined;
        this.moveNodeIndex = undefined;
        this.currNode = undefined;
    }

    addNode(pos) {

        let n1 = posToString(this.prevNode);
        let n2 = posToString(pos);
        let d = dist(this.prevNode, pos);
        this.graph.addEdge(n1, n2, d);

        if (n1 != n2)
            this.edges.push([n1, n2]);
    }

    event(e) {
        let nodePos = screenToNode(mouse, camera, zoom);
        let id = posToString(nodePos);

        if (e == "leftdown") { // Move nodes

            if (keys[17]) {

            } else {
                let nodeExists = stringExists(id, this.graph.nodes());
                if (nodeExists != undefined && this.moveNode == undefined) {
                    this.moveNode = id;
                    this.currNode = id;
                }
            }
        } else if (e == "leftup") {
                
            if (keys[17]) { // Remove node
                this.graph.removeNode(id);
                let nodePos = screenToNode(mouse, camera, zoom, true);
                for (let i = this.edges.length-1; i >= 0; i--) {
                    let edge = this.edges[i];
                    let p1 = stringToPos(edge[0]);
                    let p2 = stringToPos(edge[1]);

                    if (pDistance(nodePos.x, nodePos.y, p1.x+0.5, p1.y+0.5, p2.x+0.5, p2.y+0.5) < 0.3) {
                        this.graph.removeEdge(edge[0], edge[1]);
                        this.graph.removeEdge(edge[1], edge[0]);
                        break;
                    }
                }
            } else {
                if (this.moveNode != undefined) { // Move a placed node
                    this.updateEdges(nodePos, true);
                }
                this.moveNode = undefined;
            }

        } else if (e == "rightdown") { // Add new node

            this.prevNode = nodePos;

            if (this.moveNodeIndex == undefined) 
                this.moveNodeIndex = this.edges.length;

        } else if (e == "rightup") {
            let uniqueNode = !(this.prevNode.x == nodePos.x && this.prevNode.y == nodePos.y);
            let uniqueEdge = !stringExists(posToString(nodePos), this.graph.edges()[posToString(this.prevNode)]);

            if (uniqueNode && uniqueEdge) {
                this.moveNodeIndex = undefined;

                let noCollision = !this.checkEdgeCollision(this.prevNode, nodePos);

                if (noCollision) {
                    this.addNode(nodePos);
                } else {
                    this.graph.removeEdge(stringToPos(nodePos), stringToPos(this.prevNode))
                    this.graph.removeNode(stringToPos(this.prevNode))
                }
            }
        }
    }

    checkEdgeCollision(p1, p2) {
        var p1 = stringToPos(p1, camera, zoom);
        var p2 = stringToPos(p2, camera, zoom);

        // Check for edge collision
        let collision = false;
        for (let id in game.stations) {
            let station = game.stations[id];

            let rx = (station.pos.x-1.5 + Math.abs(Math.sin(station.angle)))+Math.sin(station.angle);
            let ry = (station.pos.y-1.5 + Math.abs(Math.cos(station.angle)))-Math.cos(station.angle);
            let rw = 1+2*Math.abs(Math.cos(station.angle));
            let rh = 1+2*Math.abs(Math.sin(station.angle));
            if (lineRect(p1.x, p1.y, p2.x, p2.y, rx, ry, rw, rh)) {
                let stationPos = nodeToScreen(new Vector(rx, ry), camera, zoom);
                drawRect(stationPos.x, stationPos.y, rw*gridBlockSize*zoom, rh*gridBlockSize*zoom, "red", {alpha: 0.5})
                station.collision = true;
                collision = true;
            }
        }

        // Check for edge overlap
        let overlap = this.checkOverlap(p1, p2);

        if (collision || overlap) {
            return true;
        }
        return false;
    }

    checkOverlap(p1, p2) {
        /*let overlap = false;

        for (let edge of this.edges) {
            let p3 = stringToPos(edge[0]);
            let p4 = stringToPos(edge[1]);

            if (dist(p1, p2) != dist(p3, p4) && lineOverlap(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y)) {
                overlap = true;
            }
        }

        return overlap;*/
        return false;
    }

    updateEdges(nodePos, revertCollision) {
        // Update edges

        this.graph.removeNode(this.currNode);

        // Move edges
        let collision = false;
        for (let edge of this.edges) {
            let exists = undefined;
            if (edge[0] == this.currNode) {
                exists = 0;
            }
            if (edge[1] == this.currNode) {
                exists = 1;
            }

            if (exists != undefined) {
                edge[exists] = posToString(nodePos);

                let d = dist(stringToPos(edge[0]), stringToPos(edge[1]));
                this.graph.addEdge(edge[0], edge[1], d);
                if (edge.bidirectional) {
                    this.graph.addEdge(edge[1], edge[0], d);
                }
            }

            if (this.checkEdgeCollision(edge[0], edge[1])) {
                collision = true;
                edge.color = "red";
            }
        }

        if (collision && revertCollision) {
            this.currNode = posToString(nodePos);
            this.updateEdges(this.moveNode);
        }
    }

    animate() {

        let nodePos = screenToNode(mouse, camera, zoom);

        // Get edges
        this.edges = [];

        if (this.graph.edges()) {
            for (let node of this.graph.nodes()) {
                let connections = this.graph.edges()[node]; 
                for (let node2 of connections) {
                    if (node != node2) {

                        let exists = false;
                        for (let edge of this.edges) {
                            if ((edge[0] == node && edge[1] == node2) || (edge[0] == node2 && edge[1] ==  node)) {
                                exists = true;
                                edge.bidirectional = true;
                                break;
                            }
                        }

                        if (!exists)
                            this.edges.push([node, node2]);
                    }
                }
            }
        }

        // Update moved node
        if (this.moveNode != undefined && mouse.left) {
            this.updateEdges(nodePos);
            this.currNode = posToString(nodePos);
        }
        
        // Add ghost edge
        if (mouse.right && this.moveNodeIndex != undefined) {
            let p1 = posToString(this.prevNode);
            let p2 = posToString(nodePos);
            this.edges[this.moveNodeIndex] = [p1, p2];
            this.edges[this.moveNodeIndex].color = this.checkEdgeCollision(p1, p2) ? "red" : "grey";
        }

        // DRAW LINES

        let roadColor = "green";
        for (let edge of this.edges) {
            let p1 = nodeToScreen(stringToPos(edge[0]), camera, zoom);
            let p2 = nodeToScreen(stringToPos(edge[1]), camera, zoom);
            drawLine(p1.x, p1.y, p2.x, p2.y, 25*zoom, edge.color || roadColor, 0.5, "round")

            let mp = new Vector((p1.x + p2.x)/2, (p1.y + p2.y)/2);
            let dir = Vector.sub(p2, p1);
            dir.normalize();
            dir.mult(15*zoom);

            let arrowOffset = 1.2;
            drawArrow(mp.x-dir.x, mp.y-dir.y, mp.x+dir.x*arrowOffset, mp.y+dir.y*arrowOffset, 5*zoom, "black", 1, "square", 15*zoom)

            if (edge.bidirectional)
                drawArrow(mp.x+dir.x, mp.y+dir.y, mp.x-dir.x*arrowOffset, mp.y-dir.y*arrowOffset, 5*zoom, "black", 1, "square", 15*zoom)

            drawCircle(p1.x, p1.y, zoom*15, roadColor);
            drawCircle(p2.x, p2.y, zoom*15, roadColor);
        }
    }
}