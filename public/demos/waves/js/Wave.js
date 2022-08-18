import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { SimplexNoise } from 'https://unpkg.com/three@0.127.0/examples/jsm/math/SimplexNoise.js';

let perlin = new SimplexNoise();

export class Wave {
	constructor(scene) {
		this.offsetX = Math.random()*1000;

		this.addGround(scene);
	}

	addGround(scene) {

		let groundGeometry = new THREE.PlaneBufferGeometry( 1000, 1000, 100, 100 );
		groundGeometry.rotateX( - Math.PI / 2 );
		groundGeometry = groundGeometry.toNonIndexed(); // ensure each face has unique vertices
		groundGeometry.attributes.position.needsUpdate = true;

		const groundMaterial = new THREE.MeshBasicMaterial( { color: "white", wireframe: true } );

		this.terrain = new THREE.Mesh( groundGeometry, groundMaterial );
		scene.add(this.terrain);

	}

	setVertices() {

		let vertex = new THREE.Vector3();
		let position = this.terrain.geometry.attributes.position;
		let smoothing = 500;
		let height = 60;
		
		for ( let i = 0, l = position.count; i < l; i ++ ) {
			vertex.fromBufferAttribute( position, i );
			vertex.y = Wave.getGroundHeight(vertex.x+this.offsetX, vertex.z);
			position.setXYZ( i, vertex.x, vertex.y, vertex.z );
		}
		
		this.terrain.geometry.attributes.position.needsUpdate = true;
		this.terrain.geometry.computeVertexNormals();
		
	}

	update(delta) {

		this.offsetX += delta*300;
		
		this.setVertices();

	}

	static getGroundHeight(x, z) {
		return 60*perlin.noise(x/500, z/500);
	}
}