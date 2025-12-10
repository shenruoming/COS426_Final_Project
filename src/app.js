/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RunningScene } from 'scenes';
import { CAMERA_Y_POS, CAMERA_Z_POS } from './components/config';
import { SeedScene } from './components/scenes';

// Initialize core ThreeJS components
const scene = new RunningScene();
// const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

// Set up camera
camera.position.set(0, 5, CAMERA_Z_POS - 10);
camera.lookAt(new Vector3(0, 0, -10));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 4;
// controls.maxDistance = 16;
// controls.update();

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    const firstCollision = scene.getObstacleCollision();
    if (firstCollision != null) {
            console.log(firstCollision);
    }
    window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

// Add event listeners
window.addEventListener('keydown', function (e) {
    const key = e.key;
    const player = scene.currentCharacter;
    // const player = scene.getObjectByName('runner');
    const paused = scene.state.paused;
    if (key.toLowerCase() == 'p') {
        if (paused) {
            scene.unpause();
            player.onUnpause();
        } else {
            scene.pause();
            player.onPause();
        }
    }
    if (
        key == 'ArrowUp' &&
        !paused &&
        typeof player.onUpKeyPressed === 'function'
    ) {
        player.onUpKeyPressed();
    }
    if (
        key == 'ArrowDown' &&
        !paused &&
        typeof player.onDownKeyPressed === 'function'
    ) {
        player.onDownKeyPressed();
    }
    if (key == 'ArrowLeft' && !paused) {
        player.onLeftKeyPressed();
    }
    if (key == 'ArrowRight' && !paused) {
        player.onRightKeyPressed();
    }
});
