class Camera {
	constructor() {

	}
}


let isGridMoving = false;
let gridStartPos = new Vector();
function moveGrid() {
	let allowMove = (keys[16] && mouse.left) || mouse.middle;
	if (allowMove && !isGridMoving) {
		isGridMoving = true;
		gridStartPos = mouse.copy();
	} else if (allowMove && isGridMoving) {
		camera = Vector.add(oldCamera, Vector.div(Vector.sub(gridStartPos, mouse), zoom))
	} else if (!allowMove && isGridMoving) {
		isGridMoving = false;
		gridStartPos = new Vector();
		oldCamera = camera.copy();
	}
}

function updateZoom(event) {
	prevZoom = zoom;
	isGridMoving = false;
	oldCamera = camera.copy();

    if (event.originalEvent.wheelDelta >= 0) {
        zoom = Math.min(zoom * 1.1, 10);
    } else {
        zoom  = Math.max(zoom / 1.1, 0.1);
    }

    let zoomOffsetX = ((canvas.width / prevZoom) - (canvas.width / zoom)) * mouse.x / canvas.width;
    camera.x += zoomOffsetX;
    oldCamera.x += zoomOffsetX;

    let zoomOffsetY = ((canvas.height / prevZoom) - (canvas.height / zoom)) * mouse.y / canvas.height;
    camera.y += zoomOffsetY;
    oldCamera.y += zoomOffsetY;
}