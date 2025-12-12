import { PATH_LENGTH, CAMERA_OFFSET, CAMERA_Z_POS, TerrainPhase } from '../../config';

class TerrainController {
    constructor(runningPath, swimmingPath, bikingPath) {
        this.phase = TerrainPhase.RUNNING;
        this.characterPhase = TerrainPhase.RUNNING;
        this.numRunLaps = 0;
        this.numSwimLaps = 0;
        this.numBikeLaps = 0;
        this.runningPath = runningPath;
        this.swimmingPath = swimmingPath;
        this.bikingPath = bikingPath;
    }
    updateTerrain() {
        if (this.phase == TerrainPhase.RUNNING && this.numRunLaps == 3) {
            this.numRunLaps = 0;
            // console.log("phase changed to swimming")
            this.phase = TerrainPhase.SWIMMING;
        } else if (this.phase == TerrainPhase.SWIMMING && this.numSwimLaps == 3) {
            this.numSwimLaps = 0;
            this.phase = TerrainPhase.BIKING;
        } else if (this.phase == TerrainPhase.BIKING && this.numBikeLaps == 3) {
            this.numBikeLaps = 0;
            this.phase = TerrainPhase.RUNNING;
        }
    }
}

export default TerrainController;
