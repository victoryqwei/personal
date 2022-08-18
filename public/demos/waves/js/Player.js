import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';

import { Wave } from './Wave.js';

export class Player {
	constructor(controls) {
		this.controls = controls;
		this.pos = new THREE.Vector3();//controls.getObject().position;
		this.vel = new THREE.Vector3();
		this.acc = new THREE.Vector3();
		this.dir = new THREE.Vector3();

		this.mass = 10;
		this.speed = 200;
		this.friction = 1;

		this.move = {
			forward: false,
			backward: false,
			left: false,
			right: false,
		}

		this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 100 );
	}

	init() {
		let self = this;
		const onKeyDown = function ( event ) {

			switch ( event.code ) {
				case 'ArrowUp':
				case 'KeyW':
					self.move.forward = true;
					break;
				case 'ArrowLeft':
				case 'KeyA':
					self.move.left = true;
					break;
				case 'ArrowDown':
				case 'KeyS':
					self.move.backward = true;
					break;
				case 'ArrowRight':
				case 'KeyD':
					self.move.right = true;
					break;
				case 'Space':
					if ( self.canJump === true ) self.vel.y += 350;
					self.canJump = false;
					break;
			}
		};

		const onKeyUp = function ( event ) {
			switch ( event.code ) {
				case 'ArrowUp':
				case 'KeyW':
					self.move.forward = false;
					break;
				case 'ArrowLeft':
				case 'KeyA':
					self.move.left = false;
					break;
				case 'ArrowDown':
				case 'KeyS':
					self.move.backward = false;
					break;
				case 'ArrowRight':
				case 'KeyD':
					self.move.right = false;
					break;
			}
		};

		document.addEventListener( 'keydown', onKeyDown );
		document.addEventListener( 'keyup', onKeyUp );
	}

	update(delta, scene) {

		this.dir.z = Number( this.move.forward ) - Number( this.move.backward );
		this.dir.x = Number( this.move.right ) - Number( this.move.left );
		this.dir.normalize(); // this ensures consistent movements in all directions

	
		let moveForce = this.dir.multiplyScalar(this.speed).clone();

		let frictionForce = new THREE.Vector3(this.vel.x * -this.friction, 0, this.vel.z * -this.friction);

		let netForce = moveForce.clone();
		netForce.sub(frictionForce);

		this.acc = netForce.divideScalar(this.mass).clone();

		this.vel.sub(this.acc);

		this.controls.moveForward( - this.vel.z * delta );
		this.controls.moveRight( - this.vel.x * delta );

		this.raycaster.ray.origin.copy( this.pos );
		const intersections = this.raycaster.intersectObjects( scene.children );
	
		if (intersections[0]) {
			let normal = intersections[0].face.normal;

			if (!normal.equals(new THREE.Vector3(0, 1, 0)) && this.canJump) {
				this.vel.y -= 9.8 * 100.0 * delta * 20; // 9.8 = gravitational acceleration, 100.0 = mass
			} else {
				this.vel.y -= 9.8 * 100.0 * delta; // 9.8 = gravitational acceleration, 100.0 = mass
			}
		} else {
			this.vel.y -= 9.8 * 100.0 * delta; // 9.8 = gravitational acceleration, 100.0 = mass
		}

		
		

		/*if ( onObject === true ) {

			this.vel.y = Math.max( 0, this.vel.y );
			canJump = true;

		}*/

		

		this.pos.y += ( this.vel.y * delta ); // new behavior

		let groundHeight = Wave.getGroundHeight(this.pos.x, this.pos.z)

		

		const onObject = intersections.length > 0;

		if ( this.pos.y < groundHeight+10) {

			this.vel.y = 0;
			this.pos.y = groundHeight+10;

			this.canJump = true;

		}
	}
}