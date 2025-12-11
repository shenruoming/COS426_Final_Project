import { Group, Box3, Mesh, BoxBufferGeometry, MeshBasicMaterial } from 'three';
import { PATH_LENGTH, CAMERA_OFFSET, CAMERA_Z_POS, TerrainPhase } from '../../config';

class SwimmingPath extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            moving: false,
            reached: false,
        };

        this.name = 'swimmingPath';

        const geometry = new BoxBufferGeometry( 8, 1, PATH_LENGTH );
        const material = new MeshBasicMaterial( { 
            color: 0x68c3c0, 
            transparent: true,
            opacity: 0.5
         } );
        // material.depthTest = false;
        material.depthWrite = false;
        const path = new Mesh( geometry, material );

        path.position.set(0, -0.5, 0);

        this.add(path);
        this.position.z = -PATH_LENGTH - 30;

        // Add self to parent's update list
        parent.addToTerrainUpdateList(this);

        this.visible = false;
    }

    update(timeStamp, terrainController) {
        const terrainPhase = terrainController.phase;
        if (terrainPhase == TerrainPhase.BIKING && this.visible) {
            this.position.z += this.parent.state.gameSpeed;
            const path = this.children[0];
            const bbox = new Box3().setFromObject(path);
            
            if (bbox.min.z > CAMERA_Z_POS + CAMERA_OFFSET) {
                this.state.moving = false;
                this.position.z = -PATH_LENGTH - 30;
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
                terrainController.numSwimLaps += 1;
            }
        }
        // attempt to change character
        if (terrainPhase == TerrainPhase.SWIMMING && terrainController.characterPhase != TerrainPhase.SWIMMING) {
            let bbox = new Box3().setFromObject(this.children[0]);
            if (bbox.max.z >= 5) {
                terrainController.characterPhase = TerrainPhase.SWIMMING;
            }
        }
    }
}

export default SwimmingPath;
