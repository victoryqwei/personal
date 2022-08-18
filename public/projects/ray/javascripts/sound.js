function gun_bang() {
    var audio = document.createElement("audio");
    audio.src = "auto.wav";
    audio.play();
}

function gun_empty() {
    var audio = document.createElement("audio");
    audio.src = "dry.wav";
    audio.play();
}

function reload() {
	if (!reloading && ammo < maxAmmo) { // Prevent multiple reloads
		reloading = true;

		reloadAudio = document.createElement("audio");
	    reloadAudio.src = "reload.mp3";
	    reloadAudio.play();

	    reloadAudio.onended = function () {
	    	reloading = false;
	    	ammo = maxAmmo;
	    }
	}
}