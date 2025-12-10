import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Bicycle.glb';

const deg2Rad = Math.PI / 180;

class Bicycle extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {};

        // Load object
        const loader = new GLTFLoader();

        this.name = 'bicycle';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        const scaleFactor = 0.8;
        this.scale.set(scaleFactor, scaleFactor, scaleFactor);
        this.position.z = 7;
        this.rotation.y = 90 * deg2Rad;

        // Add self to parent's update list
        // parent.addToUpdateList(this);
    }

    update(timeStamp) {
        if (this.state.bob) {
            // Bob back and forth
            this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        }
        if (this.state.twirl > 0) {
            // Lazy implementation of twirl
            this.state.twirl -= Math.PI / 8;
            this.rotation.y += Math.PI / 8;
        }

        // Advance tween animations, if any exist
        TWEEN.update();
    }
}

export default Bicycle;
