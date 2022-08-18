import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';

import { PointerLockControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/PointerLockControls.js';
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';

import { Player } from './Player.js';
import { Wave } from './Wave.js';

let camera, scene, renderer, controls;

let prevTime = performance.now();

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

let player;
let waves = [];

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
	camera.position.y = 100;

	scene = new THREE.Scene();
	scene.background = new THREE.Color( "black" );

	const light = new THREE.HemisphereLight( "white", 0x777788, 0.75 );
	light.position.set( 0.5, 1, 0.75 );
	scene.add( light );

	const blocker = document.getElementById( 'blocker' );
	const instructions = document.getElementById( 'instructions' );

	//controls.addEventListener("change", renderer, { passive: false });

	/*instructions.addEventListener( 'click', function () {
		controls.lock();
	});

	controls.addEventListener( 'lock', function () {
		instructions.style.display = 'none';
		blocker.style.display = 'none';
	});

	controls.addEventListener( 'unlock', function () {
		blocker.style.display = 'block';
		instructions.style.display = '';
	});*/

	//

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//

	window.addEventListener( 'resize', onWindowResize );

	controls = new OrbitControls( camera, renderer.domElement );
	controls.update();

	player = new Player(controls);

	player.init();

	for (let i = 0; i < 2; i++) waves.push(new Wave(scene))

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

	requestAnimationFrame( animate );
	stats.begin();

	const time = performance.now();

	const delta = ( time - prevTime ) / 1000;

	if ( controls.isLocked === true ) {


		player.update(delta, scene);

	}


	for (let wave of waves) wave.update(delta);

	prevTime = time;

	renderer.render( scene, camera );
	stats.end();

}