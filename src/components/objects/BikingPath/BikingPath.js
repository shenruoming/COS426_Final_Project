import { Group, Box3, Mesh, BoxBufferGeometry, MeshBasicMaterial } from 'three';
import { PATH_LENGTH, CAMERA_OFFSET, CAMERA_Z_POS, TerrainPhase } from '../../config';

class BikingPath extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            moving: false,
            reached: false,
        };

        this.name = 'bikingPath';

        const geometry = new BoxBufferGeometry( 8, 1, PATH_LENGTH );
        const material = new MeshBasicMaterial( { color: 0x38393b } );
        const path = new Mesh( geometry, material );

        path.position.set(0, -0.5, 0);
        this.add(path);
        this.position.z = -PATH_LENGTH - 40;

        // Add self to parent's update list
        parent.addToTerrainUpdateList(this);

        this.visible = false;
    }

    update(timeStamp, terrainController) {
        const terrainPhase = terrainController.phase;
        if (terrainPhase == TerrainPhase.RUNNING && this.visible) {
            this.position.z += this.parent.state.gameSpeed;
            const path = this.children[0];
            const bbox = new Box3().setFromObject(path);

            if (bbox.min.z > CAMERA_Z_POS + CAMERA_OFFSET) {
                this.state.moving = false;
                this.position.z = -PATH_LENGTH - 35;
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
                terrainController.numBikeLaps += 1;
            }
        }
        // attempt to change character
        if (terrainPhase == TerrainPhase.BIKING && terrainController.characterPhase != TerrainPhase.BIKING) {
            let bbox = new Box3().setFromObject(this.children[0]);
            if (bbox.max.z >= 5) {
                terrainController.characterPhase = TerrainPhase.BIKING;
            }
        }
    }
}

export default BikingPath;
