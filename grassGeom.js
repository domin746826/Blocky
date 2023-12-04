import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

function getGrassGeometry()
{


const geometries = [];


const pxGeometry = new THREE.PlaneGeometry( 1, 1 );
pxGeometry.attributes.uv.array[ 0 ] = 0;    pxGeometry.attributes.uv.array[ 1 ] = 0.5;
pxGeometry.attributes.uv.array[ 2 ] = 0.5;  pxGeometry.attributes.uv.array[ 3 ] = 0.5;
pxGeometry.attributes.uv.array[ 4 ] = 0;    pxGeometry.attributes.uv.array[ 5 ] = 0;
pxGeometry.attributes.uv.array[ 6 ] = 0.5;  pxGeometry.attributes.uv.array[ 7 ] = 0;
pxGeometry.rotateY( Math.PI / 2 );
pxGeometry.translate( 0.5, 0, 0 );

const nxGeometry = new THREE.PlaneGeometry( 1, 1 );
nxGeometry.attributes.uv.array[ 0 ] = 0;    nxGeometry.attributes.uv.array[ 1 ] = 0.5;
nxGeometry.attributes.uv.array[ 2 ] = 0.5;  nxGeometry.attributes.uv.array[ 3 ] = 0.5;
nxGeometry.attributes.uv.array[ 4 ] = 0;    nxGeometry.attributes.uv.array[ 5 ] = 0;
nxGeometry.attributes.uv.array[ 6 ] = 0.5;  nxGeometry.attributes.uv.array[ 7 ] = 0;
nxGeometry.rotateY( - Math.PI / 2 );
nxGeometry.translate( - 0.5, 0, 0 );

const pyGeometry = new THREE.PlaneGeometry( 1, 1 );
pyGeometry.attributes.uv.array[ 0 ] = 0.5;    pyGeometry.attributes.uv.array[ 1 ] = 1;
pyGeometry.attributes.uv.array[ 2 ] = 1;  pyGeometry.attributes.uv.array[ 3 ] = 1;
pyGeometry.attributes.uv.array[ 4 ] = 0.5;    pyGeometry.attributes.uv.array[ 5 ] = 0.5;
pyGeometry.attributes.uv.array[ 6 ] = 1;  pyGeometry.attributes.uv.array[ 7 ] = 0.5;
//pyGeometry.rotateX( Math.PI );
pyGeometry.translate( 0, 0, 0.5 );

const pzGeometry = new THREE.PlaneGeometry( 1, 1 );
pzGeometry.attributes.uv.array[ 0 ] = 0;    pzGeometry.attributes.uv.array[ 1 ] = 0.5;
pzGeometry.attributes.uv.array[ 2 ] = 0.5;  pzGeometry.attributes.uv.array[ 3 ] = 0.5;
pzGeometry.attributes.uv.array[ 4 ] = 0;    pzGeometry.attributes.uv.array[ 5 ] = 0;
pzGeometry.attributes.uv.array[ 6 ] = 0.5;  pzGeometry.attributes.uv.array[ 7 ] = 0;
pzGeometry.translate( 0, 0, 0.5 );

const nzGeometry = new THREE.PlaneGeometry( 1, 1 );
nzGeometry.attributes.uv.array[ 0 ] = 0;    nzGeometry.attributes.uv.array[ 1 ] = 0.5;
nzGeometry.attributes.uv.array[ 2 ] = 0.5;  nzGeometry.attributes.uv.array[ 3 ] = 0.5;
nzGeometry.attributes.uv.array[ 4 ] = 0;    nzGeometry.attributes.uv.array[ 5 ] = 0;
nzGeometry.attributes.uv.array[ 6 ] = 0.5;  nzGeometry.attributes.uv.array[ 7 ] = 0;
nzGeometry.rotateY( Math.PI );
nzGeometry.translate( 0, 0, - 0.5 );

const nyGeometry = new THREE.PlaneGeometry( 1, 1 );
pyGeometry.attributes.uv.array[ 5 ] = 0.5;
pyGeometry.attributes.uv.array[ 7 ] = 0.5;
pyGeometry.rotateX( Math.PI / 2 );
pyGeometry.translate( 0, -0.5, 0 );

//geometries.push(pyGeometry);
//geometries.push(nyGeometry);
geometries.push(pxGeometry);
geometries.push(nxGeometry);
geometries.push(pzGeometry);
geometries.push(nzGeometry);


const geometry = BufferGeometryUtils.mergeGeometries( geometries );
				geometry.computeBoundingSphere();
return geometry;
}

export {getGrassGeometry};
