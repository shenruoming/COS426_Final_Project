import { Group, BufferGeometry, Mesh, BoxBufferGeometry, MeshBasicMaterial } from 'three';
import { CAMERA_Z_POS, CAMERA_OFFSET } from '../../config';

class RunningPath extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            moving: false
        };

        const geometry = new BoxBufferGeometry( 8, 1, 2500 );
        const material = new MeshBasicMaterial( { color: 0x964B00 } );
        const path = new Mesh( geometry, material );

        path.position.set(0, -0.5, 0);

        this.add(path);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(timeStamp) {
        if (timeStamp > 30) {
            console.log("start moving")
            this.state.moving = true;
        }
        const path = this.children[0].geometry;
        if (this.state.moving) {
            this.position.z += 0.5;
        }
        path.computeBoundingBox();
        console.log("got here")
        console.log(path.boundingBox)
        if (path.boundingBox.min.z > CAMERA_Z_POS + CAMERA_OFFSET) {
            this.state.moving = false;
            this.visible = false;
        }
        return;
    }
}

export default RunningPath;
