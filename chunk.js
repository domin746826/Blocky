import * as THREE from 'three';

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
        this.mesh = new THREE.Mesh(); // todo
        
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
        switch(side) {
            case Sides.PY: 
                if(y == 255)
                    return false;
                return this.getLocalBlockAt(x, y+1, z) != Blocks.Air;
                
            case Sides.NY: 
                if(y == 0)
                    return false;
                return this.getLocalBlockAt(x, y-1, z) != Blocks.Air;


            case Sides.PX:
                if(x != 15)
                    return this.getLocalBlockAt(x+1, y, z) != Blocks.Air;
                else
                    return this.world.getBlockAt(blockGlobal.x+1, blockGlobal.y, blockGlobal.z) != Blocks.Air;
                
            
            case Sides.NX:
                if(x != 0)
                    return this.getLocalBlockAt(x-1, y, z) != Blocks.Air;
                else
                    return this.world.getBlockAt(blockGlobal.x-1, blockGlobal.y, blockGlobal.z) != Blocks.Air;


            case Sides.PZ:
                if(z != 15)
                    return this.getLocalBlockAt(x, y, z+1) != Blocks.Air;
                else
                    return this.world.getBlockAt(blockGlobal.x, blockGlobal.y, blockGlobal.z+1) != Blocks.Air;
            
            case Sides.NZ:
                if(z != 0)
                    return this.getLocalBlockAt(x, y, z-1) != Blocks.Air;
                else
                    return this.world.getBlockAt(blockGlobal.x, blockGlobal.y, blockGlobal.z-1) != Blocks.Air;
                
        }

    };

    loadWorld(seed) {
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

                    // if(getCave(blockGlobal.x,y,blockGlobal.z) == true)
                    //     this.setLocalBlockAt(x,y,z, Blocks.Air);

                }
            }
    }

    prerenderChunk() {
        for(let x = 0; x < 16; x++)
            for(let y = 0; y < 256; y++)
                for(let z = 0; z < 16; z++) {
                    const blockGlobal = {
                        x: this.xChunk*16+x,
                        y: y,
                        z: this.zChunk*16+z
                    };
                    if(this.getLocalBlockAt(x,y,z) == Blocks.Air) {
                        continue;
                    }
                    if(!this.isCovered(x, y, z, Sides.PY)) {
                        this.geometries.push(getFace(this.getLocalBlockAt(x,y,z), Sides.PY).translate(blockGlobal.x,blockGlobal.y,blockGlobal.z));
                    }
                    if(!this.isCovered(x, y, z, Sides.NY)) {
                        this.geometries.push(getFace(this.getLocalBlockAt(x,y,z), Sides.NY).translate(blockGlobal.x,blockGlobal.y,blockGlobal.z));
                    }
                    if(!this.isCovered(x, y, z, Sides.PZ)) {
                        this.geometries.push(getFace(this.getLocalBlockAt(x,y,z), Sides.PZ).translate(blockGlobal.x,blockGlobal.y,blockGlobal.z));
                    }
                    if(!this.isCovered(x, y, z, Sides.NZ)) {
                        this.geometries.push(getFace(this.getLocalBlockAt(x,y,z), Sides.NZ).translate(blockGlobal.x,blockGlobal.y,blockGlobal.z));
                    }
                    if(!this.isCovered(x, y, z, Sides.PX)) {
                        this.geometries.push(getFace(this.getLocalBlockAt(x,y,z), Sides.PX).translate(blockGlobal.x,blockGlobal.y,blockGlobal.z));
                    }
                    if(!this.isCovered(x, y, z, Sides.NX)) {
                        this.geometries.push(getFace(this.getLocalBlockAt(x,y,z), Sides.NX).translate(blockGlobal.x,blockGlobal.y,blockGlobal.z));
                    }

                }
        

    }

    

// fajny kod podoba mi sie
};