import { Mesh, Vector2 } from 'three';
import { Chunk } from './chunk.js'
import { Blocks, getFace } from './blocks.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { initperlin } from './worldgen.js';


export class World {
    constructor(name, scene) {
        this.name = name;
        this.scene = scene;
        this.chunksMap = new Map();
        initperlin(Math.random()*100000);
        // initperlin(2137);


        for(let x = -13; x <= 13; x++)
            for(let y = -13; y <= 13; y++) {
                this.chunksMap.set(`${x}/${y}`, new Chunk(x, y, this));
            }

        for(let x = -13; x <= 13; x++)
            for(let y = -13; y <= 13; y++) {
                this.chunksMap.get(`${x}/${y}`).loadWorld(13);
            }

        for(let x = -12; x <= 12; x++)
            for(let y = -12; y <= 12; y++) {
                this.chunksMap.get(`${x}/${y}`).prerenderChunk();
            }
    }

    getBlockAt(x, y, z) {
        const xChunk = Math.floor(x/16);
        const zChunk = Math.floor(z/16);
        const tmpChunk = this.chunksMap.get(`${xChunk}/${zChunk}`);
        if(tmpChunk == undefined)
            return Blocks.Air
        return tmpChunk.getLocalBlockAt(x-xChunk*16, y, z-zChunk*16);
    }

    getGeometry() {
        let geometries = [];
        for(let x = -12; x <= 12; x++)
            for(let y = -12; y <= 12; y++) {
                geometries = geometries.concat(this.chunksMap.get(`${x}/${y}`).geometries);

            }
        console.log(geometries);
        const geometry = BufferGeometryUtils.mergeGeometries( geometries );
        
	    geometry.computeBoundingSphere();
	    return geometry;
    }
}