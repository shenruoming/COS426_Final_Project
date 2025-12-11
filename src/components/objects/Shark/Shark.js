import * as THREE from 'three';
import { Group, AnimationMixer, Clock, Mesh, Box3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import MODEL from './Shark.glb';
import { TerrainPhase, CAMERA_OFFSET, CAMERA_Z_POS } from '../../config';
import { TerrainController } from '../TerrainController';
import { getRandomObstacleX } from '../../utils/utils';

class Shark extends Group {
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
            xDirection: 0.8
        };
        this.terrainController = parent.terrainController;

        // Load object
        const loader = new GLTFLoader();

        this.name = 'shark';
        loader.load(MODEL, (gltf) => {
            const model = gltf.scene;
            model.traverse((obj) => {
                if (obj instanceof Mesh) {
                    obj.material.metalness = 0
                    obj.material.color.offsetHSL(0,0.4,0.3)
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
        const scaleFactor = 0.25;
        this.scale.set(scaleFactor, scaleFactor, scaleFactor);

        this.position.set(x, y, z);
        if (x > 0) {
            this.state.xDirection *= -1;
            this.rotation.y = - Math.PI / 6;
        } else {
            this.rotation.y = Math.PI / 6;
        }

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

        // generate shark
        if (!inScene) {
            this.visible = true;
            this.state.inScene = true;
            this.position.y = 1;
            this.position.z -= 100;
        }
        this.position.z += this.parent.state.gameSpeed * 0.8;
        // diagonal movement
        this.position.x += this.state.xDirection * this.parent.state.gameSpeed * 0.1;
        this.position.z += 0.5 * this.parent.state.gameSpeed * 0.1;
        if (this.position.x >= 4) {
            this.state.xDirection *= -1;
            this.rotation.y = - Math.PI / 6;
        } else if (this.position.x <= -4) {
            this.state.xDirection *= -1;
            this.rotation.y = Math.PI / 6;
        }
        if (this.position.z > CAMERA_Z_POS + CAMERA_OFFSET) {
            this.position.z -= 300;
            this.position.x = getRandomObstacleX();

            if (this.position.z < this.getPathEnd()) {
                this.visible = false;
            }

            if (this.parent.obstacles_hit.has(this.uuid)) {
                this.parent.obstacles_hit.delete(this.uuid);
            }
        }
    }

    collidesWith(otherBBox) {
        const bbox = new Box3().setFromObject(this);
        return bbox.intersectsBox(otherBBox);
    }

    getPathEnd() {
        let bbox = new Box3().setFromObject(this.state.path.children[0]);
        return bbox.max.z;
    }
}

export default Shark;
