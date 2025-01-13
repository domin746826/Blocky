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
	},
	wood: {
		px: new THREE.PlaneGeometry( 1, 1 ),
		nx: new THREE.PlaneGeometry( 1, 1 ),
		py: new THREE.PlaneGeometry( 1, 1 ),
		ny: new THREE.PlaneGeometry( 1, 1 ),
		pz: new THREE.PlaneGeometry( 1, 1 ),
		nz: new THREE.PlaneGeometry( 1, 1 )
	}
	,
	cobblestone: {
		px: new THREE.PlaneGeometry( 1, 1 ),
		nx: new THREE.PlaneGeometry( 1, 1 ),
		py: new THREE.PlaneGeometry( 1, 1 ),
		ny: new THREE.PlaneGeometry( 1, 1 ),
		pz: new THREE.PlaneGeometry( 1, 1 ),
		nz: new THREE.PlaneGeometry( 1, 1 )
	},
	bedrock: {
		px: new THREE.PlaneGeometry( 1, 1 ),
		nx: new THREE.PlaneGeometry( 1, 1 ),
		py: new THREE.PlaneGeometry( 1, 1 ),
		ny: new THREE.PlaneGeometry( 1, 1 ),
		pz: new THREE.PlaneGeometry( 1, 1 ),
		nz: new THREE.PlaneGeometry( 1, 1 )
	},
	planks: {
		px: new THREE.PlaneGeometry( 1, 1 ),
		nx: new THREE.PlaneGeometry( 1, 1 ),
		py: new THREE.PlaneGeometry( 1, 1 ),
		ny: new THREE.PlaneGeometry( 1, 1 ),
		pz: new THREE.PlaneGeometry( 1, 1 ),
		nz: new THREE.PlaneGeometry( 1, 1 )
	},
	bricks: {
		px: new THREE.PlaneGeometry( 1, 1 ),
		nx: new THREE.PlaneGeometry( 1, 1 ),
		py: new THREE.PlaneGeometry( 1, 1 ),
		ny: new THREE.PlaneGeometry( 1, 1 ),
		pz: new THREE.PlaneGeometry( 1, 1 ),
		nz: new THREE.PlaneGeometry( 1, 1 )
	},
	stoneBricks: {
		px: new THREE.PlaneGeometry( 1, 1 ),
		nx: new THREE.PlaneGeometry( 1, 1 ),
		py: new THREE.PlaneGeometry( 1, 1 ),
		ny: new THREE.PlaneGeometry( 1, 1 ),
		pz: new THREE.PlaneGeometry( 1, 1 ),
		nz: new THREE.PlaneGeometry( 1, 1 )
	},
	leaves: {
		px: new THREE.PlaneGeometry( 1, 1 ),
		nx: new THREE.PlaneGeometry( 1, 1 ),
		py: new THREE.PlaneGeometry( 1, 1 ),
		ny: new THREE.PlaneGeometry( 1, 1 ),
		pz: new THREE.PlaneGeometry( 1, 1 ),
		nz: new THREE.PlaneGeometry( 1, 1 )
	},
	sandstone: {
		px: new THREE.PlaneGeometry( 1, 1 ),
		nx: new THREE.PlaneGeometry( 1, 1 ),
		py: new THREE.PlaneGeometry( 1, 1 ),
		ny: new THREE.PlaneGeometry( 1, 1 ),
		pz: new THREE.PlaneGeometry( 1, 1 ),
		nz: new THREE.PlaneGeometry( 1, 1 )
	},
	glass: {
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
	Cobblestone: 4,
	Bedrock: 5,
	Sand: 6,
	Gravel: 7,
	Wood: 8,
	Planks: 9,
	Bricks: 10,
	StoneBricks: 11,
	Leaves: 12,
	Sandstone: 13,
	Glass: 14,
}

const BlockTextures = {
	DirtFace: { x: 4, y: 4 },
	GrassTop: { x: 1, y: 4 },
	GrassSide: { x: 1, y: 1 },
	SandFace: { x: 4, y: 1 },
	GravelFace: { x: 10, y: 1 },
	StoneFace: { x: 7, y: 1 },
	WoodSide: { x: 10, y: 4 },
	WoodTop: { x: 7, y: 4 },
	CobblestoneFace: { x: 1, y: 7 },
	PlanksFace: { x: 4, y: 7 },
	GlassFace: { x: 7, y: 7 },
	LeavesFace: { x: 10, y: 7 },
	BricksFace: { x: 1, y: 10 },
	StoneBricksFace: { x: 4, y: 10 },
	BedrockFace: { x: 7, y: 10 },
	SandstoneFace: { x: 10, y: 10 }

};
const uvData = {
	Bedrock: createUvData(BlockTextures.BedrockFace),
	Planks: createUvData(BlockTextures.PlanksFace),
	Bricks: createUvData(BlockTextures.BricksFace),
	StoneBricks: createUvData(BlockTextures.StoneBricksFace),
	Leaves: createUvData(BlockTextures.LeavesFace),
	Sandstone: createUvData(BlockTextures.SandstoneFace),
	Glass: createUvData(BlockTextures.GlassFace),
	Grass: createUvData(BlockTextures.GrassSide, BlockTextures.GrassTop, BlockTextures.DirtFace),
	Dirt: createUvData(BlockTextures.DirtFace),
	Sand: createUvData(BlockTextures.SandFace),
	Gravel: createUvData(BlockTextures.GravelFace),
	Stone: createUvData(BlockTextures.StoneFace),
	Cobblestone: createUvData(BlockTextures.CobblestoneFace),
	Wood: createUvData(BlockTextures.WoodSide, BlockTextures.WoodTop, BlockTextures.WoodTop)

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
	initBlock(Blocks.Wood, geometriesFaces.wood, uvData.Wood);
	initBlock(Blocks.Cobblestone, geometriesFaces.cobblestone, uvData.Cobblestone);
	initBlock(Blocks.Bedrock, geometriesFaces.bedrock, uvData.Bedrock);
	initBlock(Blocks.Planks, geometriesFaces.planks, uvData.Planks);
	initBlock(Blocks.Bricks, geometriesFaces.bricks, uvData.Bricks);
	initBlock(Blocks.StoneBricks, geometriesFaces.stoneBricks, uvData.StoneBricks);
	initBlock(Blocks.Leaves, geometriesFaces.leaves, uvData.Leaves);
	initBlock(Blocks.Sandstone, geometriesFaces.sandstone, uvData.Sandstone);
	initBlock(Blocks.Glass, geometriesFaces.glass, uvData.Glass);

}

export {initGeometries, geometriesFaces, getFace};
