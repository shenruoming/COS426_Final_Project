import { Group, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, Box3 } from 'three';
import { PATH_LENGTH, TerrainPhase, CAMERA_OFFSET, CAMERA_Z_POS } from '../../config';
import * as THREE from 'three';
import { TerrainController } from '../TerrainController';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createNoise2D } from 'simplex-noise';
import alea from 'alea';


class Mountains extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        this.state = {
            moving: false,
            terrainController: parent.terrainController
        }

        const prng = alea('seed');
        this.noise2D = createNoise2D(prng);
        const width = 40;
        const data = this.generateTexture();

        const length = PATH_LENGTH + 40;

        let geo = new THREE.PlaneGeometry(width, length,
                                    width,length+1);
        geo.rotateX( -Math.PI / 2 );
        let position = geo.attributes.position;
        let v1 = new THREE.Vector3();
        for (let i = 0; i < position.count; i++) {
            v1.fromBufferAttribute( position, i );
            if (v1.x > -6 && v1.x < 6) continue;
            const col = data.data[i*4] // the red channel
            v1.y = Math.max(this.map(col,0,255,-5,10), 0) //map from 0:255 to -10:10
            if(v1.y > 2.8) v1.y *= 1.7 //exaggerate the peaks
            // v1.x += map(Math.random(),0,1,-0.5,0.5) //jitter x
            // v1.y += map(Math.random(),0,1,-0.5,0.5) //jitter y
            position.setY(i, v1.y);

        }
        //for every face
        v1 = new THREE.Vector3();

        geo = geo.toNonIndexed(); // ensure each face has unique vertices

        position = geo.attributes.position;
        const colorsFloor = [];
        const color = new THREE.Color();

        for ( let i = 0, l = position.count; i < l; i ++ ) {
            v1.fromBufferAttribute(position, i);
            let max = v1.y
            if(max <=0) {
                color.setHex( 0x2f3030 );
            } else if (max <= 1.5) {
                color.setHex( 0x484a4a );
            } else if (max <= 3.5) {
                color.setHex( 0xafb6bd );
            } else {
                color.setHex(0xd9dbde);
            }
            colorsFloor.push( color.r, color.g, color.b );
        }

        geo.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsFloor, 3 ) );
        // geo.colorsNeedUpdate = true
        // geo.verticesNeedUpdate = true
        const floorMaterial = new MeshPhongMaterial( { 
            vertexColors: true,
            flatShading: true,
            reflectivity: 0.5
         } );

        let material = new MeshBasicMaterial({
            color: 0x68c3c0,
            wireframe: true
        });
        const mesh = new Mesh(geo, floorMaterial);
        mesh.position.set(0, -2.5, 0);
        // mesh.receiveShadow = true;
        this.add( mesh );
        this.position.z = -PATH_LENGTH - 60;
        this.visible = false;

        // Add self to parent's update list
        parent.addToTerrainUpdateList(this);
    }

    update(timeStamp, terrainController) {
        const terrainPhase = terrainController.phase;
        if (terrainPhase == TerrainPhase.RUNNING && this.visible) {
            this.position.z += this.parent.state.gameSpeed;
            const path = this.children[0];
            const bbox = new Box3().setFromObject(path);
            
            if (bbox.min.z > CAMERA_Z_POS + CAMERA_OFFSET) {
                this.state.moving = false;
                this.position.z = -PATH_LENGTH - 55;
                this.visible = false;
            }
            return;
        }
        if (terrainPhase == TerrainPhase.SWIMMING && terrainController.numSwimLaps == 2) {
            this.visible = true;
            this.state.moving = true;
        }
        if (this.state.moving) {
            this.position.z += this.parent.state.gameSpeed;
            if (this.position.z > CAMERA_Z_POS + CAMERA_OFFSET) {
                this.position.z = 0;
            }
        }
        return;
    }

    map(val, smin, smax, emin, emax) {
        const t =  (val-smin)/(smax-smin)
        return (emax-emin)*t + emin
    }
    noise(nx, ny) {
        // Re-map from -1.0:+1.0 to 0.0:1.0
        return this.map(this.noise2D(nx,ny),-1,1,0,1)
    }
    //stack some noisefields together
    octave(nx,ny,octaves) {
        let val = 0;
        let freq = 3;
        let max = 0;
        let amp = 5;
        for(let i=0; i<octaves; i++) {
            val += this.noise(nx*freq*2,ny*freq)*amp;
            max += amp;
            amp /= 2;
            freq  *= 2;
        }
        return val/max;
    }

    //generate grayscale image of noise
    generateTexture() {
        const canvas = document.createElement('canvas');

        canvas.id = "NoiseMap";
        canvas.width = 100;
        canvas.height = PATH_LENGTH;


        const body = document.getElementsByTagName("body")[0];
        console.log(body)
        body.appendChild(canvas);

        document.getElementById("NoiseMap").style.display = 'none';
        const c = canvas.getContext('2d')
        c.fillStyle = 'black'
        c.fillRect(0,0,canvas.width, canvas.height)

        for(let i=0; i<canvas.width; i++) {
            for(let j=0; j<canvas.height; j++) {
                let v =  this.octave(i/canvas.width,j/canvas.height,15)
                const per = (100*v).toFixed(2)+'%'
                c.fillStyle = `rgb(${per},${per},${per})`
                c.fillRect(i,j,1,1)
            }
        }
        return c.getImageData(0,0,canvas.width,canvas.height)
    }

}

export default Mountains;
