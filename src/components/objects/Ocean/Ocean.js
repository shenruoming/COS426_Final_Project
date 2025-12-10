import { Group, Mesh, MeshBasicMaterial, Box3 } from 'three';
import { PATH_LENGTH, TerrainPhase, CAMERA_OFFSET, CAMERA_Z_POS } from '../../config';
import * as THREE from 'three';
import { TerrainController } from '../TerrainController';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

class Ocean extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            moving: false,
            terrainController: parent.terrainController
        }

        // ocean
        let geometry = new THREE.PlaneGeometry( 50, PATH_LENGTH + 20, 30, 30 );
        geometry.rotateX( - Math.PI / 2 );
        const mergedGeo = BufferGeometryUtils.mergeVertices(geometry);

        const positionAttribute = mergedGeo.getAttribute('position');
        positionAttribute.setUsage(THREE.DynamicDrawUsage);

        this.waves = [];
        const v = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {
            v.fromBufferAttribute(positionAttribute, i);

            this.waves.push({
                y: v.y,
                x: v.x,
                z: v.z,
                ang: Math.random() * Math.PI * 2,
                speed: 0.016 + Math.random() * 0.032
            });
        }
            
        let material = new THREE.MeshPhongMaterial({
            color: 0x68c3c0,
            transparent: true,
            flatShading: true,
        });

        const mesh = new THREE.Mesh(mergedGeo, material);
        mesh.receiveShadow = true;
        mesh.position.set(0, -2.5, 0);
        this.add( mesh );
        this.position.z = -PATH_LENGTH - 30;
        this.visible = false;

        // Add self to parent's update list
        parent.addToTerrainUpdateList(this);
    }

    update(timeStamp, terrainController) {
        if (this.visible) {
            this.moveWaves();
        }
        const terrainPhase = terrainController.phase;
        if (terrainPhase == TerrainPhase.BIKING && this.visible) {
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
        if (terrainPhase == TerrainPhase.RUNNING && terrainController.numRunLaps == 2) {
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

    moveWaves() {
        const positionAttribute = this.children[0].geometry.getAttribute('position');

        const v = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {
            v.fromBufferAttribute(positionAttribute, i);

            const vprops = this.waves[i];

            v.x = vprops.x + Math.cos(vprops.ang);
            v.y = vprops.y + Math.sin(vprops.ang) * 2;

            vprops.ang += vprops.speed;

            positionAttribute.setXY(i, v.x, v.y);
        }

        positionAttribute.needsUpdate = true;
    }

}

export default Ocean;
