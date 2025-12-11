import { Group, Box3, Clock, AnimationMixer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import MODEL from './Bird.glb';
import { CAMERA_Z_POS, CAMERA_OFFSET, TerrainPhase } from '../../config';
import { getRandomObstacleX, getRandomSideX } from '../../utils/utils';
import { TerrainController } from '../TerrainController';
import { RunningScene } from 'scenes';

class Bird extends Group {
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
            path: parent.getObjectByName('runningPath'),
            xDirection: 0.8
        };

        this.terrainController = parent.terrainController;

        // Load object
        const loader = new GLTFLoader();

        this.name = 'bird';
        loader.load(MODEL, (gltf) => {
            const model = gltf.scene;
            this.state.animation = gltf.animations[0];
            const mixer = new AnimationMixer(model);
            this.state.mixer = mixer;
            this.add(gltf.scene);
            this.state.action = this.state.mixer.clipAction(this.state.animation);
            this.state.action.play();
        });

        const scaleFactor = 0.015;
        this.scale.set(scaleFactor, scaleFactor, scaleFactor);
        this.position.set(x, y, z);
        if (x > 0) {
            this.state.xDirection *= -1;
            this.rotation.y = - Math.PI / 2;
        } else {
            this.rotation.y = Math.PI / 2;
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
        if (this.terrainController.characterPhase != TerrainPhase.BIKING) {
            if (inScene) {
                this.visible = false;
                this.state.inScene = false;
                this.position.y = -100;
            }
        } else {
            // generate birds
            if (!inScene) {
                this.visible = true;
                this.state.inScene = true;
                this.position.y = 1;
                this.position.z -= 100;
            }
            this.position.z += this.parent.state.gameSpeed * 0.75;
            // horizontal movement
            this.position.x += this.state.xDirection * this.parent.state.gameSpeed * 0.05;
            if (this.position.x >= 8) {
                this.state.xDirection *= -1;
                this.rotation.y = - Math.PI / 2;
            } else if (this.position.x <= -8) {
                this.state.xDirection *= -1;
                this.rotation.y = Math.PI / 2;
            }
            if (this.position.z > CAMERA_Z_POS + CAMERA_OFFSET) {
                this.position.z -= 200;
                this.position.x = getRandomSideX();

                if (this.parent.obstacles_hit.has(this.uuid)) {
                    this.parent.obstacles_hit.delete(this.uuid);
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

export default Bird;
