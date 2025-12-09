import { Group, BufferGeometry, MeshLambertMaterial, Mesh, BoxBufferGeometry, MeshBasicMaterial } from 'three';

class RunningPath extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        const geometry = new BoxBufferGeometry( 8, 1, 2500 );
        const material = new MeshBasicMaterial( { color: 0x964B00 } );
        const path = new Mesh( geometry, material );

        path.position.set(0, -0.5, 0);

        this.add(path);

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(timeStamp) {
        return;
    }
}

export default RunningPath;
