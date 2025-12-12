import * as THREE from 'three';
import { Group, AnimationMixer, Clock, Mesh, Box3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Dolphin.glb';
import { TerrainPhase, CAMERA_OFFSET, CAMERA_Z_POS } from '../../../config';
import { TerrainController } from '../../TerrainController';
import { sinusoid } from '../../../utils/utils';

class Dolphin extends Group {
    constructor(parent, x, y, z) {
        // Call parent Group() constructor
        super();

        this.clock = new Clock();

        // Init state
        this.state = {
            inScene: false, 
            mixer: null,
            model: null,
            animation: null,
            path: parent.getObjectByName('bikingPath'),
        };
        this.terrainController = parent.terrainController;

        // Load object
        const loader = new GLTFLoader();

        this.name = 'dolphin';
        loader.load(MODEL, (gltf) => {
            const model = gltf.scene;
            model.traverse((obj) => {
                if (obj instanceof Mesh) {
                    obj.material.metalness = 0
                    obj.material.color.offsetHSL(0,0,0.3)
                    }
                }
            )
            this.state.animation = gltf.animations[0];
            const mixer = new AnimationMixer(model);
            this.state.mixer = mixer;
            this.add(gltf.scene);
            this.state.action = this.state.mixer.clipAction(this.state.animation);
            this.state.action.play();
        });
        const scaleFactor = 0.8;
        this.scale.set(scaleFactor, scaleFactor, scaleFactor);

        this.position.set(x, y, z);

        this.visible = false;

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(timeStamp) {
        if (this.state.mixer != null) {
            const delta = this.clock.getDelta();
            this.state.mixer.update(delta);
        }

        let inScene = this.state.inScene;
        if (this.terrainController.characterPhase != TerrainPhase.SWIMMING) {
            if (inScene) {
                this.visible = false;
                this.state.inScene = false;
                this.position.y = -100;
            }
            return;
        }

        // generate dolphin
        if (!inScene) {
            this.visible = true;
            this.state.inScene = true;
            this.position.y = 1;
            this.position.z -= 100;
        }
        this.position.z += this.parent.state.gameSpeed;
        this.position.y = sinusoid(0.5, -8, 4, 0);
        if (this.position.y < -3) {
            this.visible = false;
        } else {
            this.visible = true;
        }
        this.position.z = sinusoid(0.5, this.position.z - 1, this.position.z + 1, 0)
        if (this.position.z > CAMERA_Z_POS + CAMERA_OFFSET) {
            this.position.z -= 300;

            if (this.position.z < this.getPathEnd()) {
                this.visible = false;
            }
        }
    }

    getPathEnd() {
        let bbox = new Box3().setFromObject(this.state.path.children[0]);
        return bbox.max.z + 10;
    }
}

export default Dolphin;
