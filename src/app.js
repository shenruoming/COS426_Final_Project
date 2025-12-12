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
<<<<<<< Updated upstream
=======
import heartLink from './assets/heart.png';
import runLink from './assets/runner.png';
import swimLink from './assets/swimmer.png';
import bikeLink from './assets/biker.png';
import './app.css';
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 4;
// controls.maxDistance = 16;
// controls.update();
=======
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 16;
controls.update();

// game control variables
let gameOver = false;

// Set up lives
var lives = 3;
var lifeDiv = document.createElement('div');
lifeDiv.id = 'lives';
lifeDiv.innerHTML = 'Lives: ';

// Set up hearts
let heartDiv = document.createElement('div');
heartDiv.id = 'heart';

// INTRO SCREEN: description, instruction button, begin button
let instructionsContainer = document.createElement('div');
instructionsContainer.id = 'instructions-container';

// Set up intro screen
let beginContainer = document.createElement('div');
beginContainer.id = 'begin-container';
document.body.appendChild(beginContainer);

let beginContent = document.createElement('div');
beginContent.id = 'begin-content';
beginContainer.appendChild(beginContent);

let beginContentText = document.createElement('div');
beginContentText.id = 'begin-text';
beginContent.appendChild(beginContentText);

let beginContentTitleText = document.createElement('h1');
beginContentTitleText.class = 'glow';
beginContentTitleText.innerText = 'TRIATHLON MANIA';
beginContentText.appendChild(beginContentTitleText);

let runnerDiv = document.createElement('div');
runnerDiv.id = 'runner';
let runImg = document.createElement('img');
runImg.src = runLink;
runnerDiv.appendChild(runImg);

let swimmerDiv = document.createElement('div');
swimmerDiv.id = 'swimmer';
let swimImg = document.createElement('img');
swimImg.src = swimLink;
swimmerDiv.appendChild(swimImg);

let bikerDiv = document.createElement('div');
bikerDiv.id = 'biker';
let bikeImg = document.createElement('img');
bikeImg.src = bikeLink;
bikerDiv.appendChild(bikeImg);

document.body.appendChild(runnerDiv);
document.body.appendChild(swimmerDiv);
document.body.appendChild(bikerDiv);

let beginContentDescription = document.createElement('p');
beginContentDescription.innerHTML =
    'Have you ever dreamt of conquering a triathlon? Getting off the couch and hitting the pavement, swimming the miles, and cycling the paths? But you never got to it? This is your chance to make up for your lack of athleticism. Do it from the couch, do it from your bed, do it in class. <br>Now the question is... how far can you go?';
beginContentText.appendChild(beginContentDescription);

let instructionsButton = document.createElement('div');
instructionsButton.id = 'instructions-button';
instructionsButton.innerHTML = 'INSTRUCTIONS';
beginContent.appendChild(instructionsButton);

// Set up instructions popup

let instructionsContent = document.createElement('div');
instructionsContent.id = 'instructions-content';
instructionsContainer.appendChild(instructionsContent);

let instructionsContentText = document.createElement('div');
instructionsContentText.id = 'instructions-text';
instructionsContent.appendChild(instructionsContentText);

let instructionsTitleText = document.createElement('h1');
instructionsTitleText.innerText = 'INSTRUCTIONS';
instructionsContentText.appendChild(instructionsTitleText);

let instructionsContentDescription = document.createElement('p');
instructionsContentDescription.innerHTML =
    "Avoid the obstacles. Hit 3 obstacles and you're done!<br>Collect the tokens and you gain a life!<br><br>" +
    // 'SPACE: stop/start<br>' +
    'LEFT: move left<br>' +
    'RIGHT: move right<br>' +
    'UP: jump (for running and biking only)<br>' +
    'DOWN: dive (for diving only)<br>' +
    'P: pause';
instructionsContentText.appendChild(instructionsContentDescription);

let backButton = document.createElement('div');
backButton.id = 'back-button';
backButton.innerHTML = 'BACK';
instructionsContent.appendChild(backButton);

backButton.onclick = function () {
    beginContainer.style.display = 'flex';
    instructionsContainer.style.display = 'none';
};

document.body.appendChild(instructionsContainer);

instructionsButton.onclick = function () {
    beginContainer.style.display = 'none';
    instructionsContainer.style.display = 'flex';
};

let beginContentButton = document.createElement('div');
beginContentButton.id = 'begin-button';
beginContentButton.innerHTML = 'BEGIN';
beginContent.appendChild(beginContentButton);

// Begin game
beginContentButton.onclick = function () {
    scene.unpause();
    beginContainer.style.display = 'none';
    runnerDiv.style.display = 'none';
    swimmerDiv.style.display = 'none';
    bikerDiv.style.display = 'none';
    let timeleft = 3;

    document.body.appendChild(lifeDiv);
    for (let i = 0; i < lives; i++) {
        let heartImg = document.createElement('img');
        heartImg.src = heartLink;
        heartDiv.appendChild(heartImg);
    }

    document.body.appendChild(heartDiv);
    // let countDownInterval = setInterval(function () {
    //     if (timeleft < 0) {
    //         countDownDiv.style.display = 'none';
    //         clearInterval(countDownInterval);
    //         countDownNumber.innerText = '';
    //         countDownDiv.style.display = 'none';
    //     } else if (timeleft == 0) {
    //         countDownNumber.innerText = 'Go!';
    //         go.play();
    //         scene.state.newGameStarted = true;
    //         newGameStarted = true;
    //     } else {
    //         countDownNumber.innerText = timeleft;
    //         countdown.play();
    //     }
    //     timeleft -= 1;
    // }, 1000);
};

// Set up outro screen
let endContainer = document.createElement('div');
endContainer.id = 'end-container';
document.body.appendChild(endContainer);

let endContent = document.createElement('div');
endContent.id = 'end-content';
endContainer.appendChild(endContent);

let endContentText = document.createElement('div');
endContentText.id = 'end-text';
endContent.appendChild(endContentText);

let endContentTitleText = document.createElement('h1');
endContentTitleText.innerText = 'GAME OVER';
endContentText.appendChild(endContentTitleText);

let endContentDescription = document.createElement('p');
// endContentDescription.innerHTML = 'Your score:';
endContentText.appendChild(endContentDescription);

// let endContentScore = document.createElement('h1');
// endContentScore.id = 'end-score';
// endContentText.appendChild(endContentScore);

let endContentButton = document.createElement('div');
endContentButton.id = 'end-button';
endContentButton.innerHTML = 'PLAY AGAIN';
endContent.appendChild(endContentButton);

// End game and reset by refreshing
endContentButton.onclick = function () {
    endContainer.style.display = 'none';
    scene.state.pause = false;
    // paused = false;
    lives = 3;
    // score = 0;
    gameOver = false;
    for (let i = 0; i < lives; i++) {
        let heartImg = document.createElement('img');
        heartImg.src = heartLink;
        heartDiv.appendChild(heartImg);
    }
    window.location.reload();
};

endContainer.style.display = 'none';
>>>>>>> Stashed changes

// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    // controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
<<<<<<< Updated upstream
=======
    const firstCollision = scene.getObstacleCollision();
    if (firstCollision != null) {
        console.log(firstCollision);
        lives -= 1;
        heartDiv.removeChild(heartDiv.lastChild);
    }
    // game over if lives are 0
    if (lives <= 0) {
        // if (!gameOver) {
        //     lose.play();
        // }
        gameOver = scene.pause();
        endContainer.style.display = 'flex';
        lifeDiv.style.display = 'none';
        // endContentScore.innerText = score;
    }
>>>>>>> Stashed changes
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
    const player = scene.getObjectByName('biker');
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
