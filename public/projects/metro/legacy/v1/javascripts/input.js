// INPUT

var keys = {};
onkeydown = onkeyup = function(e){
    e = e || event; 
    keys[e.keyCode] = e.type == 'keydown';
}

var mouse = new Vector();
$("#canvas").on("mousemove", function (e) {
	mouse.x = e.offsetX;
	mouse.y = e.offsetY;
})

$("#canvas").on('mousedown', function (e) {
	if (e.which == 1) {
		mouse.left = true;

		let nodePos = screenToNode(mouse, camera, zoom);

		let nodeExists = exists(nodePos, road.nodes);
		if (nodeExists != undefined) {
			road.moveNode = nodeExists;
		}
	} else if (e.which == 2) {
		mouse.middle = true;
	} else if (e.which == 3) {
		mouse.right = true;

		let nodePos = screenToNode(mouse, camera, zoom);

		if (road.nodes.length == 0) {
			road.addNode(nodePos);
		}

		if (!road.prevNode)
			road.prevNode = nodePos;
	}
	e.preventDefault();
}).on('mouseup', function (e) {
	if (e.which == 1) {
		mouse.left = false;

		let nodePos = screenToNode(mouse, camera, zoom);
		if (road.moveNode != undefined) { // Move a placed node
			road.nodes[road.moveNode] = nodePos;
		}

		road.moveNode = undefined;
	} else if (e.which == 2) {
		mouse.middle = false;
	} else if (e.which == 3) {
		mouse.right = false;

		let nodePos = screenToNode(mouse, camera, zoom);
		if (!(road.prevNode.x == nodePos.x && road.prevNode.y == nodePos.y)) { // Create a new node
			road.nodes.pop();
			road.addNode(nodePos)
		}
	}
	e.preventDefault();
})

window.oncontextmenu = function () {
	return false;
}

$(window).resize(function () {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
})

$(window).bind('mousewheel', function(event) {
	updateZoom(event);
});