import { Group, Box3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Acorn.glb';
import { CAMERA_Z_POS, CAMERA_OFFSET, TerrainPhase } from '../../config';
import { getRandomRewardX } from '../../utils/utils';
import { TerrainController } from '../TerrainController';
import { RunningScene } from 'scenes';

class FlyingAcorn extends Group {
    constructor(parent, x, y, z, deer) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            deer: deer
        };

        this.parent = parent;

        this.terrainController = parent.terrainController;

        // Load object
        const loader = new GLTFLoader();

        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        const scaleFactor = 0.5;
        this.scale.set(scaleFactor, scaleFactor, scaleFactor);
        this.position.set(x, y, z);
        this.visible = true;
    }

    update(timeStamp) {
        let inScene = this.state.inScene;
        if (this.terrainController.characterPhase != TerrainPhase.RUNNING) {
            if (inScene) {
                this.visible = false;
                this.state.inScene = false;
                this.position.y = -100;
            }
        } else {
            // generate acorn
            if (!inScene) {
                this.visible = true;
                this.state.inScene = true;
                this.position.y = 5;
                this.position.z = this.state.deer.position.z;
            }
            this.visible = true;
            this.position.z += this.parent.state.gameSpeed * 0.8;
            if (this.position.z > CAMERA_Z_POS - CAMERA_OFFSET) {
                this.visible = false;
            }
            if (this.position.z > CAMERA_Z_POS + CAMERA_OFFSET) {
                this.position.z = this.state.deer.position.z;
                this.position.x =this.state.deer.position.x;

                if (this.parent.rewards_hit.has(this.uuid)) {
                    this.parent.rewards_hit.delete(this.uuid);
                }
            }
            if (!this.state.deer.visible) {
                this.visible = false;
            }
        }
    }

    collidesWith(otherBBox) {
        const bbox = new Box3().setFromObject(this);
        return bbox.intersectsBox(otherBBox);
    }
}

export default FlyingAcorn;
