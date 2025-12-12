import { Group, Box3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Treasure.glb';
import { CAMERA_Z_POS, CAMERA_OFFSET, TerrainPhase } from '../../config';
import { getRandomRewardX, sinusoid } from '../../utils/utils';
import { TerrainController } from '../TerrainController';
import { RunningScene } from 'scenes';

class Treasure extends Group {
    constructor(parent, x, y, z) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            inScene: true,
            pastEnd: false,
            path: parent.getObjectByName('bikingPath'),
        };

        this.terrainController = parent.terrainController;

        // Load object
        const loader = new GLTFLoader();

        this.name = 'treasure';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        const scaleFactor = 2;
        this.scale.set(scaleFactor, scaleFactor, scaleFactor);
        this.position.set(x, y, z);
        this.rotation.y = - Math.PI / 2
        this.visible = false;

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(timeStamp) {
        let inScene = this.state.inScene;
        if (this.visible) {
            this.position.y = sinusoid(0.3, -2, 1.5, 0);
        }
        if (this.terrainController.characterPhase != TerrainPhase.SWIMMING) {
            if (inScene) {
                this.visible = false;
                this.state.inScene = false;
                this.position.y = -100;
            }
        } else {
            // generate treasure
            if (!inScene) {
                this.visible = true;
                this.state.inScene = true;
                this.position.y = 1.25;
                this.position.z -= 100;
            }
            this.position.z += this.parent.state.gameSpeed * 0.8;
            if (this.position.z > CAMERA_Z_POS + CAMERA_OFFSET) {
                this.position.z -= Math.floor(Math.random() * 50) + 200;
                this.position.x = getRandomRewardX() * 2.3;
                this.visible = true;

                if (this.parent.rewards_hit.has(this.uuid)) {
                    this.parent.rewards_hit.delete(this.uuid);
                }
            }
            if (this.position.z < this.getPathEnd()) {
                this.visible = false;
            }
        }
    }

    collidesWith(otherBBox) {
        const bbox = new Box3().setFromObject(this);
        return bbox.intersectsBox(otherBBox);
    }

    getPathEnd() {
        let bbox = new Box3().setFromObject(this.state.path.children[0]);
        return bbox.max.z + 10;
    }
}

export default Treasure;
