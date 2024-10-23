import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { Sides } from './chunk.js';

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

const BlockTextures = {
	DirtFace: { x: 4, y: 4 },
	GrassTop: { x: 1, y: 4 },
	GrassSide: { x: 1, y: 1 },
	SandFace: { x: 4, y: 1 },
	GravelFace: { x: 10, y: 1 },
	StoneFace: { x: 7, y: 1 }
};
const uvData = {
	Grass: createUvData(BlockTextures.GrassSide, BlockTextures.GrassTop, BlockTextures.DirtFace),
	Dirt: createUvData(BlockTextures.DirtFace),
	Sand: createUvData(BlockTextures.SandFace),
	Gravel: createUvData(BlockTextures.GravelFace),
	Stone: createUvData(BlockTextures.StoneFace)
};

function createUvData(side, top = side, bottom = side) {
	return {
		px: side,
		nx: side,
		py: top,
		ny: bottom,
		pz: side,
		nz: side
	};
}
const TXT_WIDTH = 16;
const TXT_HEIGHT = 16;


let BlockFaces = new Map();


function calculateUv(array, xPos, yPos, xRes, yRes) {
	array[0] = (xPos)/xRes; array[1] = (yPos+1)/yRes;
	array[2] = (xPos+1)/xRes; array[3] = (yPos+1)/yRes;
	array[4] = (xPos)/xRes; array[5] = (yPos)/yRes;
	array[6] = (xPos+1)/xRes; array[7] = (yPos)/yRes;
}

function initBlock(blockType, blockGeometry, blockUvData) {
	Object.keys(blockUvData).forEach(face => {
		const geometry = new THREE.PlaneGeometry(1, 1);
		const uv = blockUvData[face];
		calculateUv(geometry.attributes.uv.array, uv.x, uv.y, TXT_WIDTH, TXT_HEIGHT);

		switch (face) {
			case 'px':
				geometry.rotateY(Math.PI / 2);
				geometry.translate(0.5, 0, 0);
				break;
			case 'nx':
				geometry.rotateY(-Math.PI / 2);
				geometry.translate(-0.5, 0, 0);
				break;
			case 'py':
				geometry.rotateX(-Math.PI / 2);
				geometry.translate(0, 0.5, 0);
				break;
			case 'ny':
				geometry.rotateX(Math.PI / 2);
				geometry.translate(0, -0.5, 0);
				break;
			case 'pz':
				geometry.translate(0, 0, 0.5);
				break;
			case 'nz':
				geometry.rotateY(Math.PI);
				geometry.translate(0, 0, -0.5);
				break;
		}

		blockGeometry[face] = geometry;
	});

	BlockFaces.set(blockType, blockGeometry);
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

function initGeometries() {
	initBlock(Blocks.Grass, geometriesFaces.grass, uvData.Grass);
	initBlock(Blocks.Dirt, geometriesFaces.dirt, uvData.Dirt);
	initBlock(Blocks.Sand, geometriesFaces.sand, uvData.Sand);
	initBlock(Blocks.Gravel, geometriesFaces.gravel, uvData.Gravel);
	initBlock(Blocks.Stone, geometriesFaces.stone, uvData.Stone);
}

export {initGeometries, geometriesFaces, getFace};
