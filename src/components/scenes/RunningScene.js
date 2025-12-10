import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper } from 'three';
import { RunningPath, SwimmingPath, Grass, Spectator, Runner, TerrainController, BikingPath, Ocean, Mountains } from 'objects';
import { BasicLights } from 'lights';
import { TerrainPhase } from '../config';

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

        this.terrainController = new TerrainController();

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
        const ocean = new Ocean(this);
        this.add(swimmingPath, ocean);

        // add biking to scene
        const bikingPath = new BikingPath(this);
        const mountains = new Mountains(this);
        this.add(bikingPath, mountains);

        const runner = new Runner();
        this.addToUpdateList(runner);
        this.add(runner);

        // for debugging
        const axesHelper = new AxesHelper( 5 );
        this.add( axesHelper );

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
