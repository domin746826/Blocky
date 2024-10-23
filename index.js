import * as THREE from 'three';

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
	waterGeometry.translate(0, 59, 0);

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



	const world = new World("overworld", scene);



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



	let xChunk = 0;
	let zChunk = 0;
	
	const radiusRender = 2;

	const radiusRenderLazy = 8;


	setInterval(() => {
		const neighbours = [];
		for (let dx = -radiusRender; dx <= radiusRender; dx++) {
			for (let dz = -radiusRender; dz <= radiusRender; dz++) {
				if (Math.sqrt(dx * dx + dz * dz) <= radiusRender) {
					neighbours.push({ x: xChunk + dx, z: zChunk + dz });
				}
			}
		}
		let ignoreRest = false;
		neighbours.forEach(({ x, z }) => {
            let neighbourChunk = world.getChunkAt(x, z);
			if(!neighbourChunk.isRendered && !ignoreRest) { 
				neighbourChunk.prerenderChunk();
				ignoreRest = true;
			}
        });
		//world.getChunkAt(xChunk, zChunk).prerenderNeighbours(2);
	}, 100);

	setInterval(() => {
		const neighbours = [];
		for (let dx = -radiusRenderLazy; dx <= radiusRenderLazy; dx++) {
			for (let dz = -radiusRenderLazy; dz <= radiusRenderLazy; dz++) {
				if (Math.sqrt(dx * dx + dz * dz) <= radiusRenderLazy) {
					neighbours.push({ x: xChunk + dx, z: zChunk + dz });
				}
			}
		}
		let ignoreRest = false;
		neighbours.forEach(({ x, z }) => {
            let neighbourChunk = world.getChunkAt(x, z);
			if(!neighbourChunk.isRendered && !ignoreRest) { 
				neighbourChunk.prerenderChunk();
				ignoreRest = true;
			}
        });
		//world.getChunkAt(xChunk, zChunk).prerenderNeighbours(2);
	}, 150);

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
		Movement.moveUp(velocity.y* delta * smoothMovementFactor * speed);

		xChunk = Math.floor(camera.position.x/16);
		zChunk = Math.floor(camera.position.z/16);
		world.getChunkAt(xChunk, zChunk).loadNeighbours(9);
		
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
