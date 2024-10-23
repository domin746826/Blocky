import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

import { Blocks, getFace } from './blocks.js';
import { getHeight , getCave, getBiome} from './worldgen.js';
export const Sides = {
    PY: 0,
    NY: 1,
    PX: 2,
    NX: 3,
    PZ: 4,
    NZ: 5
};

Number.prototype.between = function(a, b) {
    var min = Math.min(a, b),
      max = Math.max(a, b);
  
    return this >= min && this <= max;
  };

export class Chunk { 
    constructor(xChunk, zChunk, world) {
        this.xChunk = xChunk;
        this.zChunk = zChunk;
        this.chunkData = new Uint16Array(16*16*256);
        this.world = world;
        this.geometries = [];
        this.mesh = new THREE.Mesh();
        this.mesh.material = world.material;
        this.world.scene.add(this.mesh);
        this.isLoaded = false;
        this.seed = world.seed;
        this.isRendered = false;
    }

    getLocalBlockAt(x, y, z) {
        if(!y.between(0, 255))
            return 0;
        return this.chunkData[x+z*16+y*256];
    }
    setLocalBlockAt(x, y, z, id) {
        this.chunkData[x+z*16+y*256] = id;
    }


    isCovered(x, y, z, side) { 
        const blockGlobal = {
            x: this.xChunk*16+x,
            y: y,
            z: this.zChunk*16+z
        };

        const checkBlock = (localX, localY, localZ, globalX, globalY, globalZ) => {
            if (localX.between(0, 15) && localY.between(0, 255) && localZ.between(0, 15)) {
                return this.getLocalBlockAt(localX, localY, localZ) != Blocks.Air;
            } else {
                return this.world.getBlockAt(globalX, globalY, globalZ) != Blocks.Air;
            }
        };

        switch(side) {
            case Sides.PY: return y < 255 && checkBlock(x, y + 1, z, blockGlobal.x, y + 1, blockGlobal.z);
            case Sides.NY: return y > 0 && checkBlock(x, y - 1, z, blockGlobal.x, y - 1, blockGlobal.z);
            case Sides.PX: return checkBlock(x + 1, y, z, blockGlobal.x + 1, y, blockGlobal.z);
            case Sides.NX: return checkBlock(x - 1, y, z, blockGlobal.x - 1, y, blockGlobal.z);
            case Sides.PZ: return checkBlock(x, y, z + 1, blockGlobal.x, y, blockGlobal.z + 1);
            case Sides.NZ: return checkBlock(x, y, z - 1, blockGlobal.x, y, blockGlobal.z - 1);
        }
    };

    loadWorld() {
        for(let x = 0; x < 16; x++)
            for(let z = 0; z < 16; z++) {
                const blockGlobal = {
                    x: this.xChunk*16+x,
                    y: 0,
                    z: this.zChunk*16+z
                };

// beach 0.12 - 0.04
                let yH = getHeight(blockGlobal.x, blockGlobal.z);
                const biomeFactor = getBiome(blockGlobal.x,blockGlobal.z);

                for(let y  = 0; y < yH; y++) {
                    // if(getCave(blockGlobal.x,y,blockGlobal.z) == true) {
                    //     this.setLocalBlockAt(x,y,z, Blocks.Air);
                    //     continue;
                    // }
                    if((y >= (yH - 5)) && (biomeFactor.a>0.05) && (biomeFactor.a < 0.13))  {// beach
                        this.setLocalBlockAt(x, y, z, Blocks.Sand);
                    }
                    else if(y <= (yH - 1) && biomeFactor.a <= 0.05) {
                        this.setLocalBlockAt(x, y, z, Blocks.Grass);
                    }
                    else if(biomeFactor.a >= 0.12 && y < 63) {
                        this.setLocalBlockAt(x,y,z, Blocks.Gravel);
                    }
                    else {
                        this.setLocalBlockAt(x, y, z, Blocks.Dirt);
                    }

                    if(biomeFactor.d > 0.4)
                        this.setLocalBlockAt(x,y,z, Blocks.Stone);

                    

                }
            }
        this.isLoaded = true;
    }

    loadNeighbours(radius = 1) { 
        const neighbours = [];
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dz = -radius; dz <= radius; dz++) {
                if (dx !== 0 || dz !== 0) {
                    neighbours.push({ x: this.xChunk + dx, z: this.zChunk + dz });
                }
            }
        }
        this.loadWorld();

        neighbours.forEach(({ x, z }) => {
            if(!this.world.chunkExists(x, z)) {
                this.world.createChunkAt(x, z);
            }

            let neighbourChunk = this.world.getChunkAt(x, z);
            if (neighbourChunk.isLoaded == false) {
                neighbourChunk.loadWorld(this.world.seed);
            }
        });
    }

    prerenderNeighbours(radius = 1) {
        const neighbours = [];
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dz = -radius; dz <= radius; dz++) {
                if (dx !== 0 || dz !== 0) {
                    neighbours.push({ x: this.xChunk + dx, z: this.zChunk + dz });
                }
            }
        }
		if(this.world.getChunkAt(this.xChunk, this.zChunk).isRendered == false)
            this.prerenderChunk();

        neighbours.forEach(({ x, z }) => {
            let neighbourChunk = this.world.getChunkAt(x, z);
            if (neighbourChunk && !neighbourChunk.isRendered) {
                neighbourChunk.prerenderChunk();
            }
        });
    }

    prerenderChunk() {
        console.log(`prerender ${this.xChunk}/${this.zChunk}`);

        const directions = [Sides.PY, Sides.NY, Sides.PX, Sides.NX, Sides.PZ, Sides.NZ];
        for(let x = 0; x < 16; x++) {
            for(let y = 0; y < 256; y++) {
                for(let z = 0; z < 16; z++) {
                    if(this.getLocalBlockAt(x, y, z) == Blocks.Air) continue;
                    const blockGlobal = { x: this.xChunk * 16 + x, y: y, z: this.zChunk * 16 + z };
                    directions.forEach(side => {
                        if(!this.isCovered(x, y, z, side)) {
                            this.geometries.push(getFace(this.getLocalBlockAt(x, y, z), side).translate(blockGlobal.x, blockGlobal.y, blockGlobal.z));
                        }
                    });
                }
            }
        }
        this.recalculateMesh();
        this.isRendered = true;
    }

    recalculateMesh() {
        const mergedGeometry = BufferGeometryUtils.mergeGeometries(this.geometries);
        this.mesh.geometry = mergedGeometry;
        this.mesh.geometry.attributes.position.needsUpdate = true;
    }

    getMesh() {
        return this.mesh;
    }

    

// fajny kod podoba mi sie
};