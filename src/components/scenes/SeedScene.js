import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import { Acorn, Land, Runner, Mountains, Deer, Shark, Boulder } from 'objects';
import { BasicLights } from 'lights';

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            updateList: [],
        };
        // const mountains = new Mountains(this);
        // this.add(mountains);

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // // Add meshes to scene
        // const land = new Land();
        // // const flower = new Flower(this);
        const lights = new BasicLights();
        this.add(lights)

        // const deer = new Deer();
        // this.add(deer);
        // const shark = new Shark();
        // this.add(shark);
        const boulder = new Boulder();
        this.add(boulder);

        const acorn = new Acorn(this, 0, 0, 0);
        this.add(acorn)
        // const runner = new Runner();

        // this.addToUpdateList(runner);
        // this.add(runner);
        // // this.add(land, flower, lights);

        // // Populate GUI
        // this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { updateList } = this.state;
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;
