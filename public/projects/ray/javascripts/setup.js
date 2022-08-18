var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = $(document).innerWidth();
canvas.height = $(document).innerHeight();

var mouse = new Vector();
var scene = {
	width: $(document).innerWidth(),
	height: $(document).innerHeight()
}

var map = {
	width: 1000,
	height: 1000
}
var minimap = {
	width: 300,
	height: 300
}
var minimapRel = {
	width: minimap.width/map.width,
	height: minimap.height/map.height
}

// Gun related variables (need to be organized)
var sensitivity = 3;
var vibrate = new Vector(canvas.width/2, canvas.height);
var shake = 1.5;
var shoot = false;
var cooldown = 0;
var ammo = 30;
var maxAmmo = ammo;
var reloading = false;
var reloadIndex = 0;
var reloadAudio;

// Client player variables
var dead = false;

// Pointer Lock API

canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

canvas.onclick = function() {
  canvas.requestPointerLock();
}

document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
  if(document.pointerLockElement === canvas ||
  document.mozPointerLockElement === canvas) {
    document.addEventListener("mousemove", canvasLoop, false);
  } else { 
    document.removeEventListener("mousemove", canvasLoop, false);
  }
}

function canvasLoop(e) {
	camera.rotate(-e.movementX * 0.0001 * sensitivity);
}

// Load Images

var gun = new Image();
gun.onload = function () {
    ctx.drawImage(gun, 75, 55, 150, 110);
}
gun.src = "gun.png";

var crosshair = new Image();
crosshair.onload = function () {
    ctx.drawImage(crosshair, 75, 55, 150, 110);
}
crosshair.src = "crosshair.png";

// Event detection -----

// Mouse

$(document).mousemove(function (e) {
	mouse.x = e.offsetX;
	mouse.y = e.offsetY;
})

$(document).mousedown(function (e) {
	mouse.down = true;
	shootGun();
}).mouseup(function (e) {
	mouse.down = false;
})

// Keyboard

var keys = [];
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    keys[e.keyCode] = e.type == 'keydown';
    /* insert conditional here */
}

// Window Resize

$(window).resize(function () {
	canvas.width = $(window).innerWidth();
	canvas.height = $(window).innerHeight();

	camera.updateFOV();
})