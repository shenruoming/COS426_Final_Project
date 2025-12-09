import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper } from 'three';
import { RunningPath, SwimmingPath, Grass, Spectator, Runner, TerrainController } from 'objects';
import { BasicLights } from 'lights';
import { TerrainPhase } from '../config';
import { BikingPath } from '../objects';

class RunningScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
            terrainUpdateList: [],
            gameSpeed: 0.5
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // add lights to scene
        const lights = new BasicLights();
        this.add(lights);

        // Add ground to scene: running
        const runningPath = new RunningPath(this);
        const grass = new Grass(this);
        this.add(runningPath, grass)

        // add spectators to scene
        for (let i = 0; i < 5; i++) {
            const spectator = new Spectator(this, -6, 10 * (i+1) - 30);
            this.add(spectator);
        }

        // add water to scene: swimming
        const swimmingPath = new SwimmingPath(this);
        this.add(swimmingPath);

        // add biking to scene
        const bikingPath = new BikingPath(this);
        this.add(bikingPath)

        const runner = new Runner();
        runner.position.x
        this.addToUpdateList(runner);
        this.add(runner);

        // for debugging
        const axesHelper = new AxesHelper( 5 );
        this.add( axesHelper );

        this.terrainController = new TerrainController();

    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    addToTerrainUpdateList(object) {
        this.state.terrainUpdateList.push(object);
    }

    update(timeStamp) {
        const { updateList, terrainUpdateList } = this.state;
        this.terrainController.updateTerrain();

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
        for (const obj of terrainUpdateList) {
            obj.update(timeStamp, this.terrainController);
        }
    }
}

export default RunningScene;
