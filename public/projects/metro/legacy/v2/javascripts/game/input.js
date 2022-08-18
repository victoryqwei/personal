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

		game.network.event("leftdown");
	} else if (e.which == 2) {
		mouse.middle = true;
	} else if (e.which == 3) {
		mouse.right = true;

		game.network.event("rightdown");

	}
	e.preventDefault();
}).on('mouseup', function (e) {
	if (e.which == 1) {
		mouse.left = false;

		game.network.event("leftup");
	} else if (e.which == 2) {
		mouse.middle = false;

		game.addBus();
	} else if (e.which == 3) {
		mouse.right = false;

		game.network.event("rightup");
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