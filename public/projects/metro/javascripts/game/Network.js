class Network {
    constructor() {

        this.graph = new Graph();

        this.edges = [];
        this.lineColors = ["green", "yellow", "red", "orange", "blue", "purple", "pink", "lime", "aqua"];
        this.lines = {};
        for (let color of this.lineColors) {
            this.lines[color] = new Line(color);
        }

        this.prevNode = undefined;
        this.moveNodeIndex = undefined;
        this.currNode = undefined;

        this.currLine = "green"; // Current line used for editing
    }

    addNode(pos, colors) {

        let n1 = posToString(this.prevNode);
        let n2 = posToString(pos);
        let d = dist(this.prevNode, pos);
        this.graph.addEdge(n1, n2, d);

        if (colors != undefined) {
            for (let color in colors)
                this.lines[color].graph.addEdge(n1, n2, d);
        } else {
            this.lines[this.currLine].graph.addEdge(n1, n2, d);
        }
        
    }

    addEdge(u, v, d, colors) {
        this.graph.addEdge(u, v, d);

        let bidirectional = false;
        for (let color in colors) {
            let sign = Math.sign(colors[color]) > 0
            if (sign) {
                this.lines[color || this.currLine].graph.addEdge(u, v, d);

                if (colors && Math.abs(colors[color]) > 1) {
                    this.lines[color || this.currLine].graph.addEdge(v, u, d);
                    bidirectional = true;
                }
            } else {

                this.lines[color || this.currLine].graph.addEdge(v, u, d);

                if (colors && Math.abs(colors[color]) > 1) {
                    this.lines[color || this.currLine].graph.addEdge(u, v, d);
                    bidirectional = true;
                }
            }   
        }

        if (bidirectional)
            this.graph.addEdge(v, u, d);
    }

    removeNode(id, colors) {
        this.graph.removeNode(id);

        if (colors == "all") { // Remove node from all graphs
            for (let color in this.lines) {
                let line = this.lines[color];

                line.graph.removeNode(id);
            }
        } else {
            for (let color of this.lineColors)
                this.lines[color || this.currLine].graph.removeNode(id);
        }
    }

    removeEdge(u, v, colors) {
        this.graph.removeEdge(u, v);
        this.graph.removeEdge(v, u);

        if (colors) {
            for (let color in colors) {
                this.lines[color || this.currLine].graph.removeEdge(u, v);
                this.lines[color || this.currLine].graph.removeEdge(v, u);
            }
        } 
    }

    getEdge(nodePos) {
        for (let i = this.edges.length-1; i >= 0; i--) {
            let edge = this.edges[i];
            let p1 = stringToPos(edge[0]);
            let p2 = stringToPos(edge[1]);

            if (pDistance(nodePos.x, nodePos.y, p1.x+0.5, p1.y+0.5, p2.x+0.5, p2.y+0.5) < 0.3) {
                return edge;
                break;
            }
        }
    }

    getColor(id) {
        for (let i = this.edges.length-1; i >= 0; i--) {
            let edge = this.edges[i];

            if (edge[0] == id || edge[1] == id) {
                return edge.color;
                break;
            }
        }
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
                this.removeNode(id);
                let nodePos = screenToNode(mouse, camera, zoom, true);
                let edge = this.getEdge(nodePos);
                if (edge)
                    this.removeEdge(edge[0], edge[1], edge.color);
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

        } else if (e == "rightup") { // Add new node and check for collision
            let uniqueNode = !(this.prevNode.x == nodePos.x && this.prevNode.y == nodePos.y);

            let uniqueEdgeColor = true;
            for (let edge of this.edges) {
                let p1, p2;
                let sign = Math.sign(edge.color[this.currLine]) > 0;

                if (sign) {
                    p1 = posToString(this.prevNode);
                    p2 = posToString(nodePos);
                } else {
                    p1 = posToString(nodePos);
                    p2 = posToString(this.prevNode);
                }

                if ((p1 == edge[0] && p2 == edge[1]) && Math.abs(edge.color[this.currLine]) > 1) {
                    for (let color in edge.color) {
                        if (color == this.currLine) {
                            uniqueEdgeColor = false;
                            
                            console.log("same color edge")
                            break;
                        }
                    }
                }
            }

            if (uniqueNode && uniqueEdgeColor) {
                this.moveNodeIndex = undefined;

                let noCollision = !this.checkEdgeCollision(this.prevNode, nodePos);

                if (noCollision) {
                    this.addNode(nodePos);
                } else {
                    this.removeNode(stringToPos(this.prevNode));
                    this.removeEdge(stringToPos(nodePos), stringToPos(this.prevNode));
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

            if (dist(p1, p2) != dist(p3, p4)) {
                overlap = true;
            }
        }

        return overlap;*/
    }

    updateEdges(nodePos, revertCollision) {
        // Update edges

        this.removeNode(this.currNode, "all");

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
                this.addEdge(edge[0], edge[1], d, edge.color);
            }

            if (this.checkEdgeCollision(edge[0], edge[1])) {
                collision = true;
                edge.collision = true;
            }
        }

        if (collision && revertCollision) {
            this.currNode = posToString(nodePos);
            this.updateEdges(this.moveNode);
        }
    }

    input() {
        let codeOffset = 49;
        for (let i = 0; i < 10; i++) {
            if (keys[codeOffset+i]) {
                this.currLine = this.lineColors[i];
            }
        }
    }

    update() {
        this.input();
    }

    getEdges() {
        // Get edges
        this.edges = [];

        if (this.graph.edges()) {
            for (let color in this.lines) { // Loops through all lines
                let line = this.lines[color];

                for (let node of line.graph.nodes()) { // Loops through all the nodes in the line
                    let connections = line.graph.edges()[node];
                    if (connections) {
                        for (let node2 of connections) {

                            let exists = false;

                            let sameDir, oppoDir = false;
                            for (let edge of this.edges) {
                                let sameDir = (edge[0] == node && edge[1] == node2);
                                let oppoDir = (node == edge[1] && node2 == edge[0]);

                                if (sameDir || oppoDir) {
                                    exists = true;

                                    

                                    let colorExists = false;
                                    for (let edgeColor in edge.color) {
                                        if (color == edgeColor) {
                                            colorExists = true;
                                            edge.color[color] = edge.color[color] * 2;
                                            break;
                                        }
                                    }
                                    if (!colorExists) {
                                        edge.color[color] = sameDir ? 1 : -1;
                                    }
                                    break;
                                }
                            }

                            if (!exists) {
                                let edge = [node, node2];
                                edge.color = {};
                                edge.color[color] = 1;
                                this.edges.push(edge);
                            }
                        }
                    }
                }
            }
        }
    }

    animate() {
        // Draw current color
        drawCircle(canvas.width-50, 50, 30, this.currLine)

        // Get edges
        this.getEdges();

        let nodePos = screenToNode(mouse, camera, zoom);

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
            this.edges[this.moveNodeIndex].color = [this.checkEdgeCollision(p1, p2) ? "red" : "grey"];
        }

        // DRAW LINES

        let edgeWidth = 30*zoom;

        for (let edge of this.edges) {
            let len = Object.keys(edge.color).length;
            for (let i = 0; i < len; i++) { // Draw multiple colors on same line
                let color = Object.keys(edge.color)[i];

                if (edge.collision)
                    color = "red";

                // Draw edge
                let p1 = nodeToScreen(stringToPos(edge[0]), camera, zoom);
                let p2 = nodeToScreen(stringToPos(edge[1]), camera, zoom);

                let sideDir = Vector.sub(p2, p1);
                sideDir.normalize();
                sideDir = Vector.rotate(sideDir, Math.PI/2);

                let index = 0;
                if (len == 2) {
                    sideDir.mult(edgeWidth/4);
                    index = (i-0.5)*2;
                } else if (len == 3) {
                    sideDir.mult(edgeWidth/3);
                    index = i-1;
                }
                
                let _p1 = Vector.add(p1, Vector.mult(sideDir, index));
                let _p2 = Vector.add(p2, Vector.mult(sideDir, index));
                drawLine(_p1.x, _p1.y, _p2.x, _p2.y, edgeWidth/len, color, 0.5, "round")
                
                // Draw arrow of edge

                let mp = new Vector((_p1.x + _p2.x)/2, (_p1.y + _p2.y)/2); // Midpoint
                let dir = Vector.sub(p2, p1);
                dir.normalize();
                dir.mult(15*zoom/len*Math.sign(edge.color[color]));
                let arrowOffset = 1.2;
                

                drawArrow(mp.x-dir.x, mp.y-dir.y, mp.x+dir.x*arrowOffset, mp.y+dir.y*arrowOffset, 5*zoom/len, "black", 1, "square", 15*zoom/len)

                if (edge.color && Math.abs(edge.color[color]) > 1) {
                    drawArrow(mp.x+dir.x, mp.y+dir.y, mp.x-dir.x*arrowOffset, mp.y-dir.y*arrowOffset, 5*zoom/len, "black", 1, "square", 15*zoom/len)
                }
                    

                // Draw nodes
                drawCircle(p1.x, p1.y, zoom*15, color);
                drawCircle(p2.x, p2.y, zoom*15, color);
            }

        }
    }
}