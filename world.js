import { Mesh, Vector2 } from 'three';
import { Chunk } from './chunk.js'
import { Blocks, getFace } from './blocks.js';
import { initperlin } from './worldgen.js';
import * as THREE from 'three';


export class World {
    constructor(name, scene) { 
        this.name = name;
        this.scene = scene;
        this.chunksMap = new Map();
        initperlin(Math.random()*100000);
        this.seed = 13;
        // initperlin(2137);

        const texture = new THREE.TextureLoader().load( './textures/blocks2.png' );
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;	
        texture.anisotropy = 16;

        const textureAlpha = new THREE.TextureLoader().load( './textures/alphamap.png' );
        textureAlpha.colorSpace = THREE.SRGBColorSpace;
        textureAlpha.magFilter = THREE.NearestFilter;
        textureAlpha.minFilter = THREE.LinearMipMapLinearFilter;	
        textureAlpha.anisotropy = 16;

	    this.material = new THREE.MeshLambertMaterial( { map: texture, alphaMap: textureAlpha, transparent: true } );

        for(let x = -3; x <= 3; x++)
            for(let y = -3; y <= 3; y++) {
                this.createChunkAt(x, y);
                console.log(`create ${x}/${y}`);
            }

        for(let x = -3; x <= 3; x++)
            for(let y = -3; y <= 3; y++) {
                this.getChunkAt(x, y).loadWorld(13);
                console.log(`gen ${x}/${y}`);
            }

        for(let x = -2; x <= 2; x++)
            for(let y = -2; y <= 2; y++) {
                this.getChunkAt(x, y).prerenderChunk();
                console.log(`place ${x}/${y}`);
            }
    }

    getBlockAt(x, y, z) {
        const xChunk = Math.floor(x/16);
        const zChunk = Math.floor(z/16);
        const tmpChunk = this.getChunkAt(xChunk, zChunk);
        if(tmpChunk == undefined)
            return Blocks.Air
        return tmpChunk.getLocalBlockAt(x-xChunk*16, y, z-zChunk*16);
    }

    getChunkAt(x, z) {  
        return this.chunksMap.get(`${x}/${z}`);
    }

    createChunkAt(x, z) {
        this.chunksMap.set(`${x}/${z}`, new Chunk(x, z, this));
    }

    chunkExists(x, z) {
        return this.chunksMap.has(`${x}/${z}`);
    }

    placeBlock(x, y, z, id) {
        const xChunk = Math.floor(x/16);
        const zChunk = Math.floor(z/16);
        this.getChunkAt(xChunk, zChunk).placeBlock(x-xChunk*16, y, z-zChunk*16, id);
    }

    destroyBlock(x, y, z) {
        const xChunk = Math.floor(x/16);
        const zChunk = Math.floor(z/16);
        this.getChunkAt(xChunk, zChunk).destroyBlock(x-xChunk*16, y, z-zChunk*16);
    }

    // getGeometry() {
    //     let geometries = [];
    //     for(let x = -4; x <= 4; x++)
    //         for(let y = -4; y <= 4; y++) {
    //             geometries = geometries.concat(this.getChunkAt(x, z).geometries);

    //         }
    //     console.log(geometries);
    //     const geometry = BufferGeometryUtils.mergeGeometries( geometries );
        
	//     geometry.computeBoundingSphere();
	//     return geometry;
    // }
}