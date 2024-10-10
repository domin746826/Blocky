import { PerlinNoise2D } from './perlin.js';



let noiseDetail, noiseCave, noiseGeneral, noiseBiome, noiseOcean, noisePlains, noiseHigherPlains, noiseMountains;


export function initperlin(seed) {

    noiseGeneral = new PerlinNoise2D(       seed*1.34425434).noise;
    noiseDetail = new PerlinNoise2D(        seed*1.97884983).noise;
    noiseCave = new PerlinNoise2D(          seed*1.68784939).noise;

    noiseBiome = new PerlinNoise2D(         seed).noise;
    noiseOcean = new PerlinNoise2D(         seed*1.11232434).noise;
    noisePlains = new PerlinNoise2D(        seed*1.34545226).noise;
    noiseHigherPlains = new PerlinNoise2D(  seed*1.34545226).noise;
    noiseMountains = new PerlinNoise2D(     seed*1.73275869).noise;

    // noiseGeneral = createNoise2D();
    // noiseDetail = createNoise2D();
    // noiseCave = createNoise3D();
    
    // noiseBiome = createNoise2D();
    // noiseOcean = createNoise2D();
    // noisePlains = createNoise2D();
    // noiseHigherPlains = createNoise2D();
    // noiseMountains = createNoise2D();

}

// d - mountains
// c - higher plains
// b - plains 
// a - ocean

export function getHeight(x,y) {
    const biomeFactor = getBiome(x,y);
    //console.log(biomeFactor);

    const plains = biomeFactor.b * (noisePlains(x/128, y/128)*3 + 3+ noisePlains(x/32, y/32)+noisePlains(x/64, y/64)*2);
    const higherPlains = biomeFactor.c * (noiseHigherPlains(x/64, y/64)*4+20);
    const mountains = biomeFactor.d * (noiseMountains(x/64, y/64)*48+48+noiseDetail(x/4, y/4)*2);
    const ocean = biomeFactor.a * (noiseOcean(x/16, y/16)*2-36)
    return Math.floor(63+plains+ocean+higherPlains+mountains+noiseDetail(x/16, y/16));//+ocean;

    // let nDetail = noiseDetail(x/32, y/32);
    // nGeneral = Math.abs(nGeneral*nGeneral*nGeneral);
    // return nGeneral*32+32;//+nDetail*2;
}

export function getBiome(x,y) {
    let nBiome = (noiseBiome(x/256, y/256)*8+noiseBiome(x/128, y/128)*4+noiseBiome(x/64, y/64)*2+noiseBiome(x/32, y/32)+15)/30;
    let biomeFactor = {
        a: 0,
        b: 0,
        c: 0,
        d: 0
    }

    if(nBiome < 0.55) {
        biomeFactor.a = Math.pow(1 - (nBiome/0.55), 1); // ocean
        
    }
    else if(nBiome < 0.6) {
        biomeFactor.b = (nBiome-0.55)*20; // up to 1 "beach"
    }
    else if(nBiome < 0.65) {
        biomeFactor.b = 1; // plains
        // biomeFactor.c = 1;
    }
    else if(nBiome < 0.7) {
        biomeFactor.b = 1;
        biomeFactor.c = ((nBiome - 0.65)*(20));
    }
    else if(nBiome < 1) {
        biomeFactor.b = 1;
        biomeFactor.c = 1;
        biomeFactor.d = Math.pow((nBiome - 0.7)* (10/3), 1);
    }

    return biomeFactor;
}


// export function getHeight(x, y) {
//     let nGeneral = noiseGeneral(x/512, y/512);
//     let nDetail = noiseDetail(x/32, y/32);
//     nGeneral = Math.abs(nGeneral*nGeneral*nGeneral);
//     return nGeneral*32+64+nDetail*2;
// }

// export function getCave(x,y,z) {
//     return noiseCave(x/16,y/16,z/16) > -0.8;
// }



export function getCave(x, y, z) {
    const caveNoise = noiseCave(x / 16, y / 16, z / 16);
    const detailNoise = noiseDetail(x / 32, z / 32);
    const threshold = -0.5;
    const heightFactor = (y - 48) / 32; 
    const modifiedNoise = caveNoise + detailNoise * 0.5 + heightFactor;

    return modifiedNoise < threshold;
}


