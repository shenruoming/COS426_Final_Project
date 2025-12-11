import { Group, SpotLight, AmbientLight, HemisphereLight, DirectionalLight } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const dir = new SpotLight('white', 0.5, 7, 0.8, 1, 1);
        const ambi = new AmbientLight(0x404040, 1.72);
        // const hemi = new HemisphereLight(0xffffbb, 0x080820, 2.3);

        dir.position.set(0, 5, -5);
        dir.target.position.set(0, 0, 0);
        this.add(ambi, dir);

        const shadowLight = new DirectionalLight(0xffffff, 0.8);

        shadowLight.position.set(-150, 350, 350);

        shadowLight.castShadow = true;

        shadowLight.shadow.camera.left = -400;
        shadowLight.shadow.camera.right = 400;
        shadowLight.shadow.camera.top = 400;
        shadowLight.shadow.camera.bottom = -400;
        shadowLight.shadow.camera.near = 1;
        shadowLight.shadow.camera.far = 1000;

        shadowLight.shadow.mapSize.width = 2048;
        shadowLight.shadow.mapSize.height = 2048;
        this.add(shadowLight);
    }
}

export default BasicLights;
