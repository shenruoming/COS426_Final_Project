import { Group, BufferGeometry, Mesh, BoxBufferGeometry, MeshBasicMaterial } from 'three';
import { CAMERA_OFFSET, CAMERA_Z_POS } from '../../config';

class Spectator extends Group {
    constructor(parent, xPos, zPos) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            cameraPos: parent.camera
        };

        const geometry = new BoxBufferGeometry( 2, 2, 2 );
        const material = new MeshBasicMaterial( { color: 'black' } );
        const person = new Mesh( geometry, material );

        person.position.set(xPos, 0, zPos);

        this.add(person);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(timeStamp) {
        this.position.z += 0.5;
        if (this.position.z > CAMERA_Z_POS + CAMERA_OFFSET) {
            this.position.z -= 1000;
        }
    }
}

export default Spectator;
