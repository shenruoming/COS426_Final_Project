import { Group, BufferGeometry, Mesh, BoxBufferGeometry, MeshBasicMaterial } from 'three';

class SwimmingPath extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        const geometry = new BoxBufferGeometry( 8, 1, 2500 );
        const material = new MeshBasicMaterial( { color: 'blue' } );
        const path = new Mesh( geometry, material );

        path.position.set(0, -0.5, -2000);

        this.add(path);

        // Add self to parent's update list
        parent.addToUpdateList(this);

        this.visible = false;
    }

    update(timeStamp) {
        
        return;
    }
}

export default SwimmingPath;
