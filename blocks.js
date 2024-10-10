import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { Sides } from './chunk.js';

const TXT_WIDTH = 4;
const TXT_HEIGHT = 4;


const geometriesFaces = {
	grass: {
		px: new THREE.PlaneGeometry( 1, 1 ),
		nx: new THREE.PlaneGeometry( 1, 1 ),
		py: new THREE.PlaneGeometry( 1, 1 ),
		ny: new THREE.PlaneGeometry( 1, 1 ),
		pz: new THREE.PlaneGeometry( 1, 1 ),
		nz: new THREE.PlaneGeometry( 1, 1 )
	},
	dirt: {
		px: new THREE.PlaneGeometry( 1, 1 ),
		nx: new THREE.PlaneGeometry( 1, 1 ),
		py: new THREE.PlaneGeometry( 1, 1 ),
		ny: new THREE.PlaneGeometry( 1, 1 ),
		pz: new THREE.PlaneGeometry( 1, 1 ),
		nz: new THREE.PlaneGeometry( 1, 1 )
	},
	sand: {
		px: new THREE.PlaneGeometry( 1, 1 ),
		nx: new THREE.PlaneGeometry( 1, 1 ),
		py: new THREE.PlaneGeometry( 1, 1 ),
		ny: new THREE.PlaneGeometry( 1, 1 ),
		pz: new THREE.PlaneGeometry( 1, 1 ),
		nz: new THREE.PlaneGeometry( 1, 1 )
	},
	gravel: {
		px: new THREE.PlaneGeometry( 1, 1 ),
		nx: new THREE.PlaneGeometry( 1, 1 ),
		py: new THREE.PlaneGeometry( 1, 1 ),
		ny: new THREE.PlaneGeometry( 1, 1 ),
		pz: new THREE.PlaneGeometry( 1, 1 ),
		nz: new THREE.PlaneGeometry( 1, 1 )
	},
	stone: {
		px: new THREE.PlaneGeometry( 1, 1 ),
		nx: new THREE.PlaneGeometry( 1, 1 ),
		py: new THREE.PlaneGeometry( 1, 1 ),
		ny: new THREE.PlaneGeometry( 1, 1 ),
		pz: new THREE.PlaneGeometry( 1, 1 ),
		nz: new THREE.PlaneGeometry( 1, 1 )
	}
}

export const Blocks = {
	Air: 0,
	Dirt: 1,
	Grass: 2,
	Stone: 3,
	Bedrock: 4,
	Sand: 5,
	Gravel: 6,

}

let BlockFaces = new Map();

function calculateUv(array, xPos, yPos, xRes, yRes)
{
	array[0] = (xPos)/xRes+0.001; array[1] = (yPos+1)/yRes-0.001;
	array[2] = (xPos+1)/xRes-0.001; array[3] = (yPos+1)/yRes-0.001;
	array[4] = (xPos)/xRes+0.001; array[5] = (yPos)/yRes+0.001;
	array[6] = (xPos+1)/xRes-0.001; array[7] = (yPos)/yRes+0.001;

}

function initGrass() {
	calculateUv(geometriesFaces.grass.px.attributes.uv.array, 0, 0, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.grass.px.rotateY( Math.PI / 2 );
	geometriesFaces.grass.px.translate( 0.5, 0, 0 );

	calculateUv(geometriesFaces.grass.nx.attributes.uv.array, 0, 0, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.grass.nx.rotateY( -Math.PI / 2 );
	geometriesFaces.grass.nx.translate( -0.5, 0, 0 );

	calculateUv(geometriesFaces.grass.pz.attributes.uv.array, 0, 0, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.grass.pz.translate( 0, 0, 0.5 );

	calculateUv(geometriesFaces.grass.nz.attributes.uv.array, 0, 0, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.grass.nz.rotateY( Math.PI );
	geometriesFaces.grass.nz.translate( 0, 0, -0.5 );

	calculateUv(geometriesFaces.grass.py.attributes.uv.array, 0, 1, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.grass.py.rotateX( -Math.PI / 2 );
	geometriesFaces.grass.py.translate( 0, 0.5, 0 );

	calculateUv(geometriesFaces.grass.ny.attributes.uv.array, 1, 0, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.grass.ny.rotateX( Math.PI / 2 );
	geometriesFaces.grass.ny.translate( 0, -0.5, 0 );


	BlockFaces.set(Blocks.Dirt, geometriesFaces.dirt);
}

function initDirt() {
	calculateUv(geometriesFaces.dirt.px.attributes.uv.array, 1, 1, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.dirt.px.rotateY( Math.PI / 2 );
	geometriesFaces.dirt.px.translate( 0.5, 0, 0 );

	calculateUv(geometriesFaces.dirt.nx.attributes.uv.array, 1, 1, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.dirt.nx.rotateY( -Math.PI / 2 );
	geometriesFaces.dirt.nx.translate( -0.5, 0, 0 );

	calculateUv(geometriesFaces.dirt.pz.attributes.uv.array, 1, 1, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.dirt.pz.translate( 0, 0, 0.5 );

	calculateUv(geometriesFaces.dirt.nz.attributes.uv.array, 1, 1, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.dirt.nz.rotateY( Math.PI );
	geometriesFaces.dirt.nz.translate( 0, 0, -0.5 );

	calculateUv(geometriesFaces.dirt.py.attributes.uv.array, 1, 1, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.dirt.py.rotateX( -Math.PI / 2 );
	geometriesFaces.dirt.py.translate( 0, 0.5, 0 );

	calculateUv(geometriesFaces.dirt.ny.attributes.uv.array, 1, 1, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.dirt.ny.rotateX( Math.PI / 2 );
	geometriesFaces.dirt.ny.translate( 0, -0.5, 0 );

	BlockFaces.set(Blocks.Grass, geometriesFaces.grass);

}

function initSand() {
	calculateUv(geometriesFaces.sand.px.attributes.uv.array, 1, 0, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.sand.px.rotateY( Math.PI / 2 );
	geometriesFaces.sand.px.translate( 0.5, 0, 0 );

	calculateUv(geometriesFaces.sand.nx.attributes.uv.array, 1, 0, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.sand.nx.rotateY( -Math.PI / 2 );
	geometriesFaces.sand.nx.translate( -0.5, 0, 0 );

	calculateUv(geometriesFaces.sand.pz.attributes.uv.array, 1, 0, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.sand.pz.translate( 0, 0, 0.5 );

	calculateUv(geometriesFaces.sand.nz.attributes.uv.array, 1, 0, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.sand.nz.rotateY( Math.PI );
	geometriesFaces.sand.nz.translate( 0, 0, -0.5 );

	calculateUv(geometriesFaces.sand.py.attributes.uv.array, 1, 0, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.sand.py.rotateX( -Math.PI / 2 );
	geometriesFaces.sand.py.translate( 0, 0.5, 0 );

	calculateUv(geometriesFaces.sand.ny.attributes.uv.array, 1, 0, TXT_WIDTH, TXT_HEIGHT);
	geometriesFaces.sand.ny.rotateX( Math.PI / 2 );
	geometriesFaces.sand.ny.translate( 0, -0.5, 0 );

	BlockFaces.set(Blocks.Sand, geometriesFaces.sand);

}

function initGravel() {
	const block = geometriesFaces.gravel;
	calculateUv(block.px.attributes.uv.array, 3, 0, TXT_WIDTH, TXT_HEIGHT);
	block.px.rotateY( Math.PI / 2 );
	block.px.translate( 0.5, 0, 0 );

	calculateUv(block.nx.attributes.uv.array, 3, 0, TXT_WIDTH, TXT_HEIGHT);
	block.nx.rotateY( -Math.PI / 2 );
	block.nx.translate( -0.5, 0, 0 );

	calculateUv(block.pz.attributes.uv.array, 3, 0, TXT_WIDTH, TXT_HEIGHT);
	block.pz.translate( 0, 0, 0.5 );

	calculateUv(block.nz.attributes.uv.array, 3, 0, TXT_WIDTH, TXT_HEIGHT);
	block.nz.rotateY( Math.PI );
	block.nz.translate( 0, 0, -0.5 );

	calculateUv(block.py.attributes.uv.array, 3, 0, TXT_WIDTH, TXT_HEIGHT);
	block.py.rotateX( -Math.PI / 2 );
	block.py.translate( 0, 0.5, 0 );

	calculateUv(block.ny.attributes.uv.array, 3, 0, TXT_WIDTH, TXT_HEIGHT);
	block.ny.rotateX( Math.PI / 2 );
	block.ny.translate( 0, -0.5, 0 );

	BlockFaces.set(Blocks.Gravel, block);

}


function initStone() {
	const block = geometriesFaces.stone;
	calculateUv(block.px.attributes.uv.array, 2, 0, TXT_WIDTH, TXT_HEIGHT);
	block.px.rotateY( Math.PI / 2 );
	block.px.translate( 0.5, 0, 0 );

	calculateUv(block.nx.attributes.uv.array, 2, 0, TXT_WIDTH, TXT_HEIGHT);
	block.nx.rotateY( -Math.PI / 2 );
	block.nx.translate( -0.5, 0, 0 );

	calculateUv(block.pz.attributes.uv.array, 2, 0, TXT_WIDTH, TXT_HEIGHT);
	block.pz.translate( 0, 0, 0.5 );

	calculateUv(block.nz.attributes.uv.array, 2, 0, TXT_WIDTH, TXT_HEIGHT);
	block.nz.rotateY( Math.PI );
	block.nz.translate( 0, 0, -0.5 );

	calculateUv(block.py.attributes.uv.array, 2, 0, TXT_WIDTH, TXT_HEIGHT);
	block.py.rotateX( -Math.PI / 2 );
	block.py.translate( 0, 0.5, 0 );

	calculateUv(block.ny.attributes.uv.array, 2, 0, TXT_WIDTH, TXT_HEIGHT);
	block.ny.rotateX( Math.PI / 2 );
	block.ny.translate( 0, -0.5, 0 );

	BlockFaces.set(Blocks.Stone, block);

}

function getFace(id, side) {

	switch(side) {
		case Sides.PY:
			return BlockFaces.get(id).py.clone();
		case Sides.NY:
			return BlockFaces.get(id).ny.clone();
		case Sides.PX:
			return BlockFaces.get(id).px.clone();
		case Sides.NX:
			return BlockFaces.get(id).nx.clone();
		case Sides.PZ:
			return BlockFaces.get(id).pz.clone();
		case Sides.NZ:
			return BlockFaces.get(id).nz.clone();
	} 
}

function initGeometries()
{
	// const geometries = [];


	// geometries.push(geometriesFaces.grass.px.clone());
	// geometries.push(geometriesFaces.grass.nx.clone());

	// geometries.push(geometriesFaces.grass.pz.clone());
	// geometries.push(geometriesFaces.grass.nz.clone());

	// geometries.push(geometriesFaces.grass.py.clone());
	// geometries.push(geometriesFaces.grass.ny.clone());

	// console.log(geometries);

	// const geometry = BufferGeometryUtils.mergeGeometries( geometries );
	// 				geometry.computeBoundingSphere();
	// return geometry;
	initStone();
	initDirt();
	initGrass();
	initSand();
	initGravel();
}

export {initGeometries, geometriesFaces, getFace};
