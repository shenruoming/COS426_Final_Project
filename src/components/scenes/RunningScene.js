import * as Dat from 'dat.gui';
import { Group, Scene, Color, AxesHelper } from 'three';
import { RunningPath, SwimmingPath, Grass, Spectator, Runner } from 'objects';
import { BasicLights } from 'lights';

class RunningScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
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

        const runner = new Runner();
        runner.position.x
        this.addToUpdateList(runner);
        this.add(runner);

        // for debugging
        const axesHelper = new AxesHelper( 5 );
        this.add( axesHelper );

    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default RunningScene;
