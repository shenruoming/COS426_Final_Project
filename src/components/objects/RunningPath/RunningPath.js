import { Group, BufferGeometry, Mesh, BoxBufferGeometry, MeshBasicMaterial, PlaneGeometry, DoubleSide, Box3 } from 'three';
import { CAMERA_Z_POS, CAMERA_OFFSET, PATH_LENGTH, TerrainPhase } from '../../config';
import { TerrainController } from '../TerrainController';

class RunningPath extends Group {
    constructor(parent, terrainController) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            moving: true,
            reached: false,
            terrainController: terrainController
        };

        const geometry = new BoxBufferGeometry( 8, 1, PATH_LENGTH );
        const material = new MeshBasicMaterial( { color: 0x964B00 } );
        const path = new Mesh( geometry, material );

        path.position.set(0, -0.5, 10);

        this.add(path);
        this.position.z = -PATH_LENGTH / 2;

        // Add self to parent's update list
        parent.addToTerrainUpdateList(this);
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
                this.position.z = -PATH_LENGTH - 50;
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
                terrainController.numRunLaps += 1;
            }
        }
    }
}

export default RunningPath;
