import { Group, BufferGeometry, Mesh, BoxBufferGeometry, MeshBasicMaterial, Box3 } from 'three';
import { PATH_LENGTH, TerrainPhase, CAMERA_OFFSET, CAMERA_Z_POS } from '../../config';
import * as THREE from 'three';
import { TerrainController } from '../TerrainController';

class Grass extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Add self to parent's update list
        parent.addToTerrainUpdateList(this);

        this.state = {
            moving: true,
            terrainController: parent.terrainController
        }

        const vertex = new THREE.Vector3();
        const color = new THREE.Color();

        const grassShades = [0x228B22, 0xAAFF00, 0x355E3B, 0x4CBB17];


        // floor

		let geometry = new THREE.PlaneGeometry( 20, PATH_LENGTH, 100, 100 );
		geometry.rotateX( - Math.PI / 2 );

        // vertex displacement

        let position = geometry.attributes.position;

        for ( let i = 0, l = position.count; i < l; i ++ ) {

            vertex.fromBufferAttribute( position, i );

            vertex.x += Math.random() * 20 - 10;
            vertex.y += Math.random() * 2;
            vertex.z += Math.random() * 2 - 10;

            position.setXYZ( i, vertex.x, vertex.y, vertex.z );

        }

        geometry = geometry.toNonIndexed(); // ensure each face has unique vertices

        position = geometry.attributes.position;
        const colorsFloor = [];

        for ( let i = 0, l = position.count; i < l; i ++ ) {
            let index = Math.floor(Math.random() * 4);
            color.setHex( grassShades[index] );
            colorsFloor.push( color.r, color.g, color.b );

        }

        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsFloor, 3 ) );

        const floorMaterial = new MeshBasicMaterial( { vertexColors: true } );

        const floor = new Mesh( geometry, floorMaterial );
        floor.position.set(0, -2.5, 0);
        this.add( floor );
    }

    update(timeStamp, terrainController) {
        const terrainPhase = terrainController.phase;
        if (terrainPhase == TerrainPhase.SWIMMING && this.visible) {
            this.position.z += this.parent.state.gameSpeed;
            const path = this.children[0];
            let bbox = new Box3().setFromObject(path);
            
            if (bbox.min.z > CAMERA_Z_POS + CAMERA_OFFSET) {
                console.log("got to shifting path")
                this.state.moving = false;
                this.position.z = -PATH_LENGTH - 45;
                this.visible = false;
            }
            return;
        }
        if (terrainPhase == TerrainPhase.BIKING && terrainController.numBikeLaps == 2) {
            console.log("start run moving");
            this.visible = true;
            this.state.moving = true;
        }

        if (this.state.moving) {
            this.position.z += this.parent.state.gameSpeed;
            if (this.position.z > CAMERA_Z_POS + CAMERA_OFFSET) {
                this.position.z = 0;
            }
        }
    }
}

export default Grass;
