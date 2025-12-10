import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Shark.glb';

class Shark extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {

        };

        // Load object
        const loader = new GLTFLoader();

        this.name = 'shark';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        const scaleFactor = 0.1;
        this.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Add self to parent's update list
        // parent.addToUpdateList(this);
    }

    update(timeStamp) {
    }
}

export default Shark;
