import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { Water } from 'three/addons/objects/Water2.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

import * as Utils from './utils.js';
import * as Movement from './movement.js';
import { initGeometries } from './blocks.js';
import { World } from './world.js';
import { getBiome } from './worldgen.js';
let fpsSmooth = 60;
let cameraDistance = 4;
function updateFps(fps)
{
	fpsSmooth = (fpsSmooth*3+fps)/4;
	document.getElementById("fps").innerText = "FPS: " + Math.floor(fps);
}

// export function getBiome(x,y)
{/* <div id="xyz">XYZ: 0/0/0</div>
<div id="biome">Biome ABCD: 0/0/0/0</div> */}
function updateXyz(x, y, z) {
	document.getElementById("xyz").innerText = "XYZ: " + Math.floor(x) + "/" + Math.floor(y) + "/" + Math.floor(z);
}

function updateBiome(biomeFactor) {
	document.getElementById("biome").innerText = "Biome ABCD: " + Math.floor(biomeFactor.a*100)/100 + "/" 
	+ Math.floor(biomeFactor.b*100)/100 + "/" + Math.floor(biomeFactor.c*100) /100+ "/" + Math.floor(biomeFactor.d*100)/100;
}

function main()
{
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	initGeometries();
	

	
	


	scene.background = new THREE.Color(0x87CEEB);

	const ambient = new THREE.AmbientLight( 0x606060 );
	scene.add( ambient );
	const sun = new THREE.DirectionalLight( 0xffffff, 4 );
	sun.position.set( 5, 20, 30 );
	scene.add( sun );

	const waterGeometry = new THREE.PlaneGeometry(4096, 4096); // water
	waterGeometry.rotateX(-Math.PI/2);
	waterGeometry.translate(0, 63, 0);

	// Materiał półprzezroczysty w kolorze niebieskim
	const waterMaterial = new THREE.MeshBasicMaterial({
	  color: 0x4444aa,  // niebieski
	  transparent: true,
	  opacity: 0.9      // półprzezroczystość
	});
	
	// Mesh
	const waterPlane = new THREE.Mesh(waterGeometry, waterMaterial);
	scene.add(waterPlane);

	const helper = new THREE.DirectionalLightHelper( sun, 5 );
	scene.add( helper );
		
	const renderer = new THREE.WebGLRenderer({
		antialias: true // Włączenie antialiasingu
	  });	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );


	window.addEventListener('resize', ()=> {
		var newWidth = window.innerWidth;
		var newHeight = window.innerHeight;

		camera.aspect = newWidth / newHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(newWidth, newHeight);
	}, false);


	const axesHelper = new THREE.AxesHelper( 1 );
scene.add( axesHelper );

	const geometry = new THREE.BoxGeometry( 5, 1, 2 );
	const material = new THREE.MeshLambertMaterial( { color: 0xbbbbbb } );
	const playerMesh = new THREE.Mesh( geometry, material );
	scene.add( playerMesh );

	const anotherGeom = new THREE.BoxGeometry( 7, 2, 7 );
	const anotherMesh = new THREE.Mesh( anotherGeom, material );
	scene.add( anotherMesh );

	anotherMesh.position.set(1, -1.5, 3);
	playerMesh.position.set(6, -1.5, 0);

	const texture = new THREE.TextureLoader().load( './textures/custom/grass.png' );
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.magFilter = THREE.NearestFilter;
	texture.minFilter = THREE.NearestFilter;
	
	let world = new World("overworld", scene);

	// world.getGeometry();
	console.log(world.getGeometry());

	const grass = new THREE.Mesh(	world.getGeometry(), new THREE.MeshLambertMaterial( { map: texture, side: THREE.FrontSide } ) );
	scene.add( grass );

	grass.position.set(0, 4, 2);

	camera.position.set(0, 80, 0);




	let oldFrameDate = performance.now();
	let fpsTimer = 0;
	let tenFramesLengthOld = 0;
	let tenFramesLengthRaw = 0;



	const raycaster = new THREE.Raycaster();

	let direction = new THREE.Vector3();
	let velocity = new THREE.Vector3();
	let onBlock = false;
	let delta;

	Movement.setupMouseAndKeyboard(renderer);
	Movement.setPlayerPosition(camera.position);
	Movement.setPlayerRotation(camera.rotation);

	

	function animate()
	{
		requestAnimationFrame( animate );
		let current = performance.now();
		delta = Math.max(current - oldFrameDate, 1)/1000;
		oldFrameDate = current;
		if(document.hidden) {
			delta = 0.001;
		}





		direction.y = Movement.keys.forward;
		direction.x = Movement.keys.right;
		direction.z = Movement.keys.up;
		direction.normalize();

		const smoothMovementFactor = 15;
		const speed = 24;

		velocity.x -= velocity.x * smoothMovementFactor * delta;
		velocity.z -= velocity.z * smoothMovementFactor * delta;
		velocity.y -= velocity.y * smoothMovementFactor * delta;

		velocity.z += direction.y * delta;
		velocity.x += direction.x * delta;
		//velocity.y -= 9.81 * 0.04 * delta;
		velocity.y += direction.z * delta;



		Movement.moveForward(velocity.z * delta * smoothMovementFactor * speed);
		Movement.moveRight(velocity.x * delta * smoothMovementFactor * speed);
		Movement.moveUp(velocity.y* delta * smoothMovementFactor * speed)


		updateXyz(camera.position.x, camera.position.y, camera.position.z);
		updateBiome(getBiome(camera.position.x,camera.position.z));
		// if(onBlock === true && Movement.keys.up == 1)
		// {
		// 	onBlock = false;
		// 	velocity.y = 0.08;
		// 	camera.position.y += velocity.y;
		// }

		//playerMesh.position.y += Movement.keys.up * currentFrameLength * 0.01;

		// raycaster.set(camera.position, new THREE.Vector3(0, -1, 0));
		// const intersects = raycaster.intersectObjects( scene.children );

		// let floorLvl = 0;
		// if(intersects[0] != undefined)
		// 	floorLvl = camera.position.y - intersects[0].distance;
		// else
		// 	floorLvl = -9999;
		
		// if(camera.position.y <= floorLvl + 1.61)
		// {
		// 	camera.position.y = floorLvl + 1.6;
		// 	velocity.y = Math.max(velocity.y, 0);
      	// 	onBlock = true;
		// }
		// else
		// {	
		// 	camera.position.y += velocity.y;
      	// 	onBlock = false;
		// 	if(camera.position.y < floorLvl + 1.61)
		// 	{
		// 		camera.position.y = floorLvl + 1.6;
		// 		velocity.y = Math.max(velocity.y, 0);
        // 		onBlock = true;
		// 	}
		// }




		


		Movement.setCurrentDelta(delta*1000);
		camera.rotation.set(Movement.direction.y, Movement.direction.x, 0, 'ZYX');

		if(fpsTimer++ >= 19)
		{
			tenFramesLengthRaw = performance.now();
			updateFps(20000/Math.max(tenFramesLengthRaw-tenFramesLengthOld, 1));
			tenFramesLengthOld = tenFramesLengthRaw;
			fpsTimer = 0;
		}

		renderer.render( scene, camera );  
 	}
	
	animate();
}


export {main}; 
