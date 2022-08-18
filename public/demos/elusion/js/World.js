import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { SimplexNoise } from 'https://unpkg.com/three@0.127.0/examples/jsm/math/SimplexNoise.js';

let perlin = new SimplexNoise();

export class World {
	constructor() {

	}

	init(scene) {
		this.addGround(scene);
	}

	addGround(scene) {
		// ground

		let vertex = new THREE.Vector3();

		let groundGeometry = new THREE.PlaneBufferGeometry( 1000, 1000, 100, 100 );
		groundGeometry.rotateX( - Math.PI / 2 );

		// vertex displacement

		let position = groundGeometry.attributes.position;
		let smoothing = 500;
		let height = 60;

		for ( let i = 0, l = position.count; i < l; i ++ ) {

			vertex.fromBufferAttribute( position, i );

			vertex.y = World.getGroundHeight(vertex.x, vertex.z);

			position.setXYZ( i, vertex.x, vertex.y, vertex.z );

		}

		groundGeometry = groundGeometry.toNonIndexed(); // ensure each face has unique vertices
		groundGeometry.attributes.position.needsUpdate = true;
		groundGeometry.computeVertexNormals();

		const groundMaterial = new THREE.MeshStandardMaterial( { color: "#138510" } );

		const terrain = new THREE.Mesh( groundGeometry, groundMaterial );
		scene.add(terrain);
	}

	static getGroundHeight(x, z) {
		return 0//60*perlin.noise(x/500, z/500);
	}
}