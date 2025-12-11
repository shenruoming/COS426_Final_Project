import { Group, AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Shark.glb';

class Shark extends Group {
    constructor(parent, x, y, z) {
        // Call parent Group() constructor
        super();


        // Init state
        this.state = {
            terrainController: parent.terrainController,
            inScene: true
        };

        // Load object
        const loader = new GLTFLoader();

        this.name = 'shark';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
            this.setupModel(gltf);
        });

        const scaleFactor = 0.1;
        this.scale.set(scaleFactor, scaleFactor, scaleFactor);
        this.position.set(x, y, z);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    setupModel(data) {
        const model = data.scene.children[0];
        const clip = data.animations[0];

        const mixer = new AnimationMixer(model);
        const action = mixer.clipAction(clip);
        action.play();
        model.update = (delta) => mixer.update(delta);
        return model;
    }
}

export default Shark;
