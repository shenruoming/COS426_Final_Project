import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper } from 'three';
import {
    RunningPath,
    SwimmingPath,
    Grass,
    Spectator,
    Runner,
    Swimmer,
    Biker,
    TerrainController,
    BikingPath,
    Ocean,
    Mountains,
} from 'objects';
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
            gameSpeed: 0,
            prevGameSpeed: 1,
            paused: true,
        };

        this.gameOver = false;

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // add lights to scene
        const lights = new BasicLights();
        this.add(lights);

        this.terrainController = new TerrainController();

        // add player to scene: runner, swimmer, biker
        // const runner = new Runner();
        // this.addToUpdateList(runner);
        // this.add(runner);

        // const swimmer = new Swimmer();
        // this.addToUpdateList(swimmer);
        // this.add(swimmer);

        const biker = new Biker();
        this.addToUpdateList(biker);
        this.add(biker);

        // Add ground to scene: running
        const runningPath = new RunningPath(this);
        const grass = new Grass(this);
        this.add(runningPath, grass);

        // add spectators to scene
        for (let i = 0; i < 5; i++) {
            const spectator = new Spectator(this, -6, 10 * (i + 1) - 30);
            this.add(spectator);
        }

        // add water to scene: swimming
        const swimmingPath = new SwimmingPath(this);
        const ocean = new Ocean(this);
        this.add(swimmingPath, ocean);

        const bikingPath = new BikingPath(this);
        const mountains = new Mountains(this);
        this.add(bikingPath, mountains);

        // for debugging
        const axesHelper = new AxesHelper(5);
        this.add(axesHelper);
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

    pause() {
        this.state.paused = true;
        this.state.prevGameSpeed = this.state.gameSpeed;
        this.state.gameSpeed = 0;
    }

    unpause() {
        this.state.paused = false;
        this.state.gameSpeed = this.state.prevGameSpeed;
    }
}

export default RunningScene;
