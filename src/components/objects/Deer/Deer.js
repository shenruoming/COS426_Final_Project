import { Group, Box3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Deer.glb';
import { CAMERA_Z_POS, CAMERA_OFFSET, TerrainPhase } from '../../config';
import { getRandomObstacleX } from '../../utils/utils';
import { TerrainController } from '../TerrainController';
import { RunningScene } from 'scenes';

class Deer extends Group {
    constructor(parent, x, y, z) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            terrainController: parent.terrainController,
            inScene: true,
        };

        // Load object
        const loader = new GLTFLoader();

        this.name = 'deer';
        loader.load(MODEL, (gltf) => {
            this.add(gltf.scene);
        });

        const scaleFactor = 0.05;
        this.scale.set(scaleFactor, scaleFactor, scaleFactor);
        this.position.set(x, y, z);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(timeStamp) {
        let inScene = this.state.inScene;
        if (this.state.terrainController.characterPhase != TerrainPhase.RUNNING) {
            if (inScene) {
                this.visible = false;
                this.state.inScene = false;
                this.position.y = -100;
            }
        } else {
            if (!inScene) {
                this.visible = true;
                this.state.inScene = true;
                this.position.y = 3;
                this.position.z -= 250;
            }
            this.position.z += this.parent.state.gameSpeed * 0.8;
            if (this.position.z > CAMERA_Z_POS + CAMERA_OFFSET) {
                this.position.z -= 300;
                this.position.x = getRandomObstacleX();

                if (this.parent.obstacles_hit.has(this.uuid)) {
                    this.parent.obstacles_hit.delete(this.uuid);
                }
            }
        }
    }

    collidesWith(otherBBox) {
        const bbox = new Box3().setFromObject(this);
        return bbox.intersectsBox(otherBBox);
    }
}

export default Deer;
