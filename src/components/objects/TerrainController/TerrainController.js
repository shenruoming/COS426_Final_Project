import { PATH_LENGTH, CAMERA_OFFSET, CAMERA_Z_POS, TerrainPhase } from '../../config';

class TerrainController {
    constructor(runningPath, swimmingPath, bikingPath) {
        this.phase = TerrainPhase.RUNNING;
        this.characterPhase = TerrainPhase.RUNNING;
        this.startRunTime = new Date() / 1000;
        this.startSwimTime = -1;
        this.startBikeTime = -1;
        this.numRunLaps = 0;
        this.numSwimLaps = 0;
        this.numBikeLaps = 0;
        this.runningPath = runningPath;
        this.swimmingPath = swimmingPath;
        this.bikingPath = bikingPath;
    }
    // update() {
    //     const currTime = new Date() / 1000;
    //     if (this.phase == TerrainPhase.RUNNING) {
    //         if (currTime - this.startRunTime > 10) {
    //             this.phase = TerrainPhase.RUNNING_END;
    //         }
    //     } else if (this.phase == TerrainPhase.SWIMMING) {
    //         if (currTime - this.startSwimTime > 10) {
    //             this.phase = TerrainPhase.SWIMMING_END;
    //         }
    //     } else if (this.phase == TerrainPhase.BIKING) {
    //         if (currTime - this.startBikeTime > 10) {
    //             this.phase = TerrainPhase.BIKING_END;
    //         }
    //     }
    // }
    updateTerrain() {
        if (this.phase == TerrainPhase.RUNNING && this.numRunLaps == 3) {
            this.numRunLaps = 0;
            console.log("phase changed to swimming")
            this.phase = TerrainPhase.SWIMMING;
        } else if (this.phase == TerrainPhase.SWIMMING && this.numSwimLaps == 3) {
            this.numSwimLaps = 0;
            this.phase = TerrainPhase.BIKING;
        } else if (this.phase == TerrainPhase.BIKING && this.numBikeLaps == 3) {
            this.numBikeLaps = 0;
            this.phase = TerrainPhase.RUNNING;
        }
    }
    // getPathEnd(terrainPhase) {
    //     let path = null;
    //     if (terrainPhase == TerrainPhase.RUNNING) {
    //         path = this.runningPath.children[0]
    //     } else if (terrainPhase == TerrainPhase.SWIMMING) {
    //         path = this.swimmingPath.children[0];
    //     } else {
    //         path = this.bikingPath.children[0];
    //     }
    //     let bbox = new Box3().setFromObject(path);
    //     return bbox.min.z;
    // }
}

export default TerrainController;
