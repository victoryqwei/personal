// Gun controls

function displayGun() {
	ctx.save();
	ctx.translate(vibrate.x, vibrate.y);
	ctx.rotate(reloadIndex*Math.PI/180);
	ctx.translate(0, -canvas.height/2)
	ctx.drawImage( gun, 0, 0 );
	ctx.restore();

	ctx.drawImage(crosshair, canvas.width/2-25, canvas.height/2-25, 50, 50);

	if (mouse.down && ammo > 0 && !reloading) { // Mouse is down, ammo is not empty, and not reloading
		// Vibration effect
		vibrate.x += shake;
		vibrate.y += shake;

		if (vibrate.x < canvas.width/2) {
			vibrate.x = canvas.width/2;
		}
		if (vibrate.y < canvas.height) {
			vibrate.y = canvas.height;
		}

		// Gun cooldown
		cooldown += 1;
		if (cooldown > 6) {
			shootGun();
		}
		
	} else if (!reloading) {
		vibrate = new Vector(canvas.width/2, canvas.height);
	}

	// Reload animation
	if (reloading) {
		if (reloadAudio.currentTime < reloadAudio.duration/2) {
			reloadIndex += 1.2;
			vibrate.y += 1;
		} else if (reloadAudio.currentTime > "0" && (reloadIndex > 1.8 && vibrate.y > canvas.height)) {
			reloadIndex -= 1.8;
			vibrate.y -= 1.5;
		}
	} else {
		reloadIndex = 0;
	}
}

function shootGun() {
	if (ammo > 0 && !reloading) {
		gun_bang();
		shoot = true;
		cooldown = 0;
		shake *= -1;

		ammo -= 1;
	} else if (!reloading) {
		gun_empty();
	}
}