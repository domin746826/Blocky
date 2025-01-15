import * as THREE from 'three';

import * as Movement from './movement.js';
import { initGeometries } from './blocks.js';
import { World } from './world.js';
import { getBiome } from './worldgen.js';
import { Blocks } from './blocks.js';

let fpsSmooth = 60;
let cameraDistance = 4;
function updateFps(fps)
{
	fpsSmooth = (fpsSmooth*3+fps)/4;
	document.getElementById("fps").innerText = "FPS: " + Math.floor(fps);
}
let selectedSlot = 0; //0-8

let slots = new Array(9).fill(Blocks.Air);
slots[0] = Blocks.Stone;
slots[1] = Blocks.Dirt;
slots[2] = Blocks.Planks;
slots[3] = Blocks.Gravel;
slots[4] = Blocks.Glass;
slots[5] = Blocks.Wood;
slots[6] = Blocks.Planks;
slots[7] = Blocks.StoneBricks;
slots[8] = Blocks.Bricks;


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
		antialias: true, // Włączenie antialiasingu
		alpha: true,
		reverseDepthBuffer: true,
		powerPreference: "high-performance"
	  });	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	  renderer.setFace
	window.addEventListener('resize', ()=> {
		var newWidth = window.innerWidth;
		var newHeight = window.innerHeight;

		camera.aspect = newWidth / newHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(newWidth, newHeight);
	}, false);



	const world = new World("overworld", scene);



	camera.position.set(0, 80, 0);


	function setFocusOnSlot(slotIndex) {
		for (let i = 1; i <= 9; i++) {
			document.getElementById("itemslot" + i)?.classList.remove("focused");
		}
		document.getElementById("itemslot" + (slotIndex + 1))?.classList.add("focused");
	}

	window.addEventListener('wheel', (event) => {
		if (event.deltaY < 0) {
			selectedSlot--;
		} else {
			selectedSlot++;
		}
		if(selectedSlot < 0)
			selectedSlot = 0;
		if(selectedSlot > 8)
			selectedSlot = 8;
		
		setFocusOnSlot(selectedSlot);
	});



	window.addEventListener("mousedown", (event) => {
		raycaster.setFromCamera( new THREE.Vector3(0, 0, 1), camera );
		const intersects = raycaster.intersectObjects( scene.children );
		if(intersects[0] != undefined) {
			if(event.buttons == 1) {
				console.log(intersects[0]);
				if(intersects[0].distance > 5)
					return;
				const { point, normal } = intersects[0];
				const xyzCoord = point.clone().sub(normal.clone().multiplyScalar(0.5)).round();
				world.destroyBlock(xyzCoord.x, xyzCoord.y, xyzCoord.z);
			}
			else if(event.buttons == 2)
			{
				console.log(intersects[0]);
				if(intersects[0].distance > 5)
					return;
				const { point, normal } = intersects[0];
				const xyzCoord = point.clone().sub(normal.clone().multiplyScalar(-0.5)).round();
				world.placeBlock(xyzCoord.x, xyzCoord.y, xyzCoord.z, slots[selectedSlot]);
			}
		}
	});


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

	const radiusRenderLazy = 5;


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
	}, 30);

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
	}, 150);
	const worldVelocity = {x: 0, y: 0};
	let avgDelta = 0.01;

	function animate() {
		requestAnimationFrame(animate);
		let current = performance.now();
		delta = Math.max(current - oldFrameDate, 1) / 1000;
		oldFrameDate = current;
		if (document.hidden) delta = 0.001;

		avgDelta = (avgDelta * 15 + delta) / 16;

		updateMovement();
		handleCollisions();
		updateCameraPosition();
		updateHud();

		if (fpsTimer++ >= 19) {
			tenFramesLengthRaw = performance.now();
			updateFps(20000 / Math.max(tenFramesLengthRaw - tenFramesLengthOld, 1));
			tenFramesLengthOld = tenFramesLengthRaw;
			fpsTimer = 0;
		}

		renderer.render(scene, camera);
	}

	function updateMovement() {
		direction.set(Movement.keys.right, Movement.keys.forward, 0).normalize();
		const smoothMovementFactor = 15;
		const speed = Movement.keys.up == -1 ? 1 : 4.5;
		const sprintingMultiplier = (Movement.sprinting? 1.5:0.9)* (Movement.flying? 2:1);
		console.log(sprintingMultiplier)


		velocity.x -= velocity.x * smoothMovementFactor * avgDelta;
		velocity.z -= velocity.z * smoothMovementFactor * avgDelta;
		if(!Movement.flying) { // walking
			velocity.y -= 9.81 * 0.27 * avgDelta;
		}
		else { // flying
			velocity.y -= velocity.y * smoothMovementFactor * avgDelta;
			velocity.y += Movement.keys.up * avgDelta*10;
		}

		velocity.z += direction.y * avgDelta;
		velocity.x += direction.x * avgDelta;

		worldVelocity.x = Movement.worldVelocityForward(velocity.z * avgDelta * smoothMovementFactor * speed*sprintingMultiplier).x + Movement.worldVelocityRight(velocity.x * avgDelta * smoothMovementFactor * sprintingMultiplier*speed).x;
		worldVelocity.z = Movement.worldVelocityForward(velocity.z * avgDelta * smoothMovementFactor * speed*sprintingMultiplier).z + Movement.worldVelocityRight(velocity.x * avgDelta * smoothMovementFactor * sprintingMultiplier*speed).z;
	}

	function handleCollisions() {
		const blocks = getSurroundingBlocks();
		const blockBelow = blocks.blockBelowPx || blocks.blockBelowNx || blocks.blockBelowPz || blocks.blockBelowNz;
		const blockAbove = blocks.blockOver;

		if (blockBelow && velocity.y <= 0.05) {
			velocity.y = 0;
			camera.position.y = Math.round(camera.position.y - 1.65) + 2.05;
			if (Movement.keys.up == 1) velocity.y = 0.65;
		}
		if (blockAbove && velocity.y >= 0.05) {
			velocity.y = 0;
			camera.position.y = Math.round(camera.position.y + 0.3) - 0.6;
		}

		handleHorizontalCollisions(blocks);
	}

	function handleHorizontalCollisions(blocks) {
		const { blockPx, blockNx, blockPz, blockNz, blockPxMiddle, blockNxMiddle, blockPzMiddle, blockNzMiddle, blockPxHigher, blockNxHigher, blockPzHigher, blockNzHigher } = blocks;

		if (blockPx || blockPxHigher || blockPxMiddle) {
			camera.position.x = Math.max(camera.position.x, Math.round(camera.position.x + 0.8) - 0.8);
			worldVelocity.x = Math.max(0, worldVelocity.x);
		}
		if (blockNx || blockNxHigher || blockNxMiddle) {
			camera.position.x = Math.min(camera.position.x, Math.round(camera.position.x - 0.8) + 0.8);
			worldVelocity.x = Math.min(0, worldVelocity.x);
		}
		if (blockPz || blockPzHigher || blockPzMiddle) {
			camera.position.z = Math.max(camera.position.z, Math.round(camera.position.z + 0.8) - 0.8);
			worldVelocity.z = Math.max(0, worldVelocity.z);
		}
		if (blockNz || blockNzHigher || blockNzMiddle) {
			camera.position.z = Math.min(camera.position.z, Math.round(camera.position.z - 0.8) + 0.8);
			worldVelocity.z = Math.min(0, worldVelocity.z);
		}
	}

	// i know it's worse than just getting the block at the position, but it's easier to handle collisions this way, in future i will write better code, i promise!
	function getSurroundingBlocks() {
		return {
			blockBelowPx: world.getBlockAt(Math.round(camera.position.x + 0.25), Math.round(camera.position.y - 1.65), Math.round(camera.position.z)),
			blockBelowNx: world.getBlockAt(Math.round(camera.position.x - 0.25), Math.round(camera.position.y - 1.65), Math.round(camera.position.z)),
			blockBelowPz: world.getBlockAt(Math.round(camera.position.x), Math.round(camera.position.y - 1.65), Math.round(camera.position.z + 0.25)),
			blockBelowNz: world.getBlockAt(Math.round(camera.position.x), Math.round(camera.position.y - 1.65), Math.round(camera.position.z - 0.25)),
			blockOver: world.getBlockAt(Math.round(camera.position.x), Math.round(camera.position.y + 0.3), Math.round(camera.position.z)),
			blockPx: world.getBlockAt(Math.round(camera.position.x + 0.3), Math.round(camera.position.y - 1.4), Math.round(camera.position.z)),
			blockNx: world.getBlockAt(Math.round(camera.position.x - 0.3), Math.round(camera.position.y - 1.4), Math.round(camera.position.z)),
			blockPz: world.getBlockAt(Math.round(camera.position.x), Math.round(camera.position.y - 1.4), Math.round(camera.position.z + 0.3)),
			blockNz: world.getBlockAt(Math.round(camera.position.x), Math.round(camera.position.y - 1.4), Math.round(camera.position.z - 0.3)),
			blockPxMiddle: world.getBlockAt(Math.round(camera.position.x + 0.3), Math.round(camera.position.y - 0.7), Math.round(camera.position.z)),
			blockNxMiddle: world.getBlockAt(Math.round(camera.position.x - 0.3), Math.round(camera.position.y - 0.7), Math.round(camera.position.z)),
			blockPzMiddle: world.getBlockAt(Math.round(camera.position.x), Math.round(camera.position.y - 0.7), Math.round(camera.position.z + 0.3)),
			blockNzMiddle: world.getBlockAt(Math.round(camera.position.x), Math.round(camera.position.y - 0.7), Math.round(camera.position.z - 0.3)),
			blockPxHigher: world.getBlockAt(Math.round(camera.position.x + 0.3), Math.round(camera.position.y), Math.round(camera.position.z)),
			blockNxHigher: world.getBlockAt(Math.round(camera.position.x - 0.3), Math.round(camera.position.y), Math.round(camera.position.z)),
			blockPzHigher: world.getBlockAt(Math.round(camera.position.x), Math.round(camera.position.y), Math.round(camera.position.z + 0.3)),
			blockNzHigher: world.getBlockAt(Math.round(camera.position.x), Math.round(camera.position.y), Math.round(camera.position.z - 0.3))
		};
	}

	function updateCameraPosition() {
		Movement.moveUp(velocity.y * avgDelta * 15);
		camera.position.x -= worldVelocity.x;
		camera.position.z -= worldVelocity.z;

		xChunk = Math.floor(camera.position.x / 16);
		zChunk = Math.floor(camera.position.z / 16);
		world.getChunkAt(xChunk, zChunk).loadNeighbours(9);

		Movement.setCurrentDelta(delta * 1000);
		camera.rotation.set(Movement.direction.y, Movement.direction.x, 0, 'ZYX');
	}

	function updateHud() {
		updateXyz(camera.position.x, camera.position.y, camera.position.z);
		updateBiome(getBiome(camera.position.x, camera.position.z));
	}
	
	animate();
}


export {main}; 
