import { Group, BufferGeometry, Mesh, BoxBufferGeometry, MeshBasicMaterial } from 'three';
import { PATH_LENGTH } from '../../config';

class Grass extends Group {
    constructor(parent) {
        // Call parent Group() constructor
        super();

        const geometry = new BoxBufferGeometry( 20, -1, PATH_LENGTH );
        const material = new MeshBasicMaterial( { color: 0x388004 } );
        const path = new Mesh( geometry, material );

        path.position.set(0, -0.5, 0);

        this.add(path);

        // Add self to parent's update list
        parent.addToTerrainUpdateList(this);
    }

    update(timeStamp, terrainPhase) {
        return;
    }
}

export default Grass;
