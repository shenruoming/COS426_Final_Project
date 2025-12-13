import * as Dat from 'dat.gui';
import {
    Scene,
    Color,
    AxesHelper,
    Box3,
    TextureLoader,
    RepeatWrapping,
} from 'three';
import {
    Nest,
    RunningPath,
    SwimmingPath,
    Grass,
    Spectator,
    Runner,
    Swimmer,
    Biker,
    TerrainController,
    BikingPath,
    Ocean,
    Mountains,
    Deer,
    Shark,
    Bird,
    Acorn,
    Treasure,
    Dolphin,
    Dory,
    Nemo,
    Stingray,
    Whale,
    MTree,
    Bush,
    Tree,
    Lightning
} from 'objects';
import { BasicLights } from 'lights';
import {
    TerrainPhase,
    obstacleXPositions,
    CAMERA_Z_POS,
    CAMERA_OFFSET,
} from '../config';
import {
    getRandomObstacleX,
    getRandomSideX,
    getRandomRewardX,
    getRandomExtraX
} from '../utils/utils';
import splash from '../../sounds/shark.wav';
import deer from '../../sounds/deer.wav';
import squawk from '../../sounds/squawk.wav';

// Add sounds
const splashSound = new Audio(splash);
splashSound.load();

const deerSound = new Audio(deer);
deerSound.load();

const squawkSound = new Audio(squawk);
squawkSound.load();

class RunningScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
            terrainUpdateList: [],
            gameSpeed: 0,
            prevGameSpeed: 0.5,
            paused: true,
            gameOver: false,
            backgroundColors: [
                0xffb3ba, 0xffdfba, 0xffffba, 0xbaffc9, 0xbae1ff,
            ],
            colorIndex: 0,
            fadeDuration: 5000,
            colorFadeStartTime: Date.now(),
        };

        // Set background to a nice color
        this.background = new Color(
            this.state.backgroundColors[this.state.colorIndex]
        );

        // add lights to scene
        const lights = new BasicLights();
        this.add(lights);

        this.terrainController = new TerrainController();

        this.obstacles_hit = new Set();
        this.rewards_hit = new Set();

        // for switching character based on terrain
        this.characterSwitch();

        // Add ground to scene: running
        const runningPath = new RunningPath(this);
        const grass = new Grass(this);
        this.add(runningPath, grass);

        this.obstacles = [];
        this.rewards = [];

        this.allRunObstacles = [];
        this.allRunRewards = [];
        this.allSwimObstacles = [];
        this.allSwimRewards = [];
        this.allBikeObstacles = [];
        this.allBikeRewards = [];

        // add water to scene: swimming
        const swimmingPath = new SwimmingPath(this);
        const ocean = new Ocean(this);
        this.add(swimmingPath, ocean);

        const bikingPath = new BikingPath(this);
        const mountains = new Mountains(this);
        this.add(bikingPath, mountains);

        // Add running obstacles to scene
        const hasAcorn = [
            true,
            false,
            false,
            true,
            false,
            false,
            false,
            false,
            true,
            true,
            false,
            false,
            true,
            false,
        ];
        const deerZPositions = [
            -20, -40, -70, -90, -110, -80, -50, -100, -140, -160, -180, -210,
            -240, -270, -240,
        ];
        for (let i = 0; i < 14; i++) {
            const x = getRandomObstacleX();
            const deer = new Deer(this, x, 1.8, deerZPositions[i], hasAcorn[i]);
            this.add(deer);
            this.obstacles.push(deer);
            this.allRunObstacles.push(deer);
        }
        // add sharks
        const sharkZPositions = [
            -20, -80, -110, -50, -100, -140, -160, -180, -210, -240,
        ];
        let direction = 1;
        for (let i = 0; i < 10; i++) {
            const x = getRandomObstacleX();
            const shark = new Shark(
                this,
                -4 * direction,
                1,
                sharkZPositions[i] + 100
            );
            this.add(shark);
            this.obstacles.push(shark);
            this.allSwimObstacles.push(shark);
            direction *= -1;
        }
        // add birds
        const birdZPositions = [
            -20, -110, -160, -210, -140, -160, -180, -210, -240,
        ];
        for (let i = 0; i < 4; i++) {
            const x = getRandomSideX();
            const bird = new Bird(
                this,
                -6 * direction,
                1,
                birdZPositions[i] + 100
            );
            this.add(bird);
            this.obstacles.push(bird);
            this.allBikeObstacles.push(bird);
            direction *= -1;
        }

        // add acorns (running rewards)
        const acornZPositions = [-35, -85, -100];
        for (let i = 0; i < 3; i++) {
            const x = getRandomRewardX() * 2;
            const acorn = new Acorn(this, x, 1, acornZPositions[i]);
            this.add(acorn);
            this.rewards.push(acorn);
            this.allRunRewards.push(acorn);
        }


        // add birdNest
        const nestZPositions = [-20, -40, -70, -90, -110, -80, -50, -100, -140, -160, -180, -210,
            -240, -270, -240,];
        for (let i = 0; i < 14; i++) {
            const x = getRandomExtraX();
            const nest = new Nest(this, -6, 0, nestZPositions[i]);
            this.add(nest);
        }

        // add trees
        const treePositions = [0, -10, -5, -15, -20, -40, -70, -90, -110, -80, -50, -100, -140, -160, -180, -210,
            -240, -270, -240,];
        for (let i = 0; i < 18; i++) {
            const x = getRandomExtraX();
            const tree = new MTree(this, x, -1, treePositions[i]);
            this.add(tree);
        }

        // add bushes
        const bushPositions = [10, 5, 7, 0, -10, -5, -15, -20, -40, -90, -110, -80, -100, -140,  -210,
            -240, -270, -240,];
        for (let i = 0; i < 18; i++) {
            const x = getRandomExtraX();
            const bush = new Bush(this, x, 0, bushPositions[i]);
            this.add(bush);
        }

        // add more trees
        const treeTPositions = [10, -10, -5, -15, -20, -40, -90, -110, -80,  -210,
            -240, -270, -240,];
        for (let i = 0; i < 13; i++) {
            const x = getRandomExtraX();
            const treee = new Tree(this, x, 5.5, treeTPositions[i]);
            this.add(treee);
        }

        // add treasure (swimming rewards)
        const treasureZPositions = [-15, -85, -100, -125];
        for (let i = 0; i < 3; i++) {
            const x = getRandomRewardX() * 2.3;
            const treasure = new Treasure(
                this,
                x,
                1,
                treasureZPositions[i] + 100
            );
            this.add(treasure);
            this.rewards.push(treasure);
            this.allSwimRewards.push(treasure);
        }

        // add lightning (biking rewards)
        const lightningPos = [-15, -85, -100, -125];
        for (let i = 0; i < 3; i++) {
            const x = getRandomRewardX() * 2;
            const lightning = new Lightning(this, x, 1, lightningPos[i]);
            this.add(lightning);
            this.rewards.push(lightning);
            this.allBikeRewards.push(lightning);
        }

        // for spectator's random x position
        function getRandomInt(min, max) {
            const minCeiled = Math.ceil(min);
            const maxFloored = Math.floor(max);
            return (
                Math.floor(Math.random() * (maxFloored - minCeiled + 1)) +
                minCeiled
            );
        }

        const num_spectators = 150;
        // const spectatorZPositions = [-10, -60, -150, -90, -210, -240];
        for (let i = 0; i < num_spectators; i++) {
            // random side and random x-location
            const side = getRandomSideX();
            let x = 0;
            if (side == -6) {
                x = getRandomInt(-11, -6);
            } else if (side == 6) {
                x = getRandomInt(6, 12);
            }
            const z = -(i / num_spectators) * 400 + 10;
            const y = 0.4;

            const spectator = new Spectator(this, x, y, z, side);
            this.add(spectator);
        }

        // for debugging
        const axesHelper = new AxesHelper(5);
        this.add(axesHelper);

        this.addSeaCreatures();
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    addToTerrainUpdateList(object) {
        this.state.terrainUpdateList.push(object);
    }

    update(timeStamp) {
        const {
            updateList,
            terrainUpdateList,
        } = this.state;
        this.terrainController.updateTerrain();

        // for new terrain... switch character
        if (this.terrainController.characterPhase !== this.currentPhase) {
            this.characterSwitch(this.terrainController.characterPhase);
        }

        const {
            backgroundColors,
            colorIndex,
            fadeDuration,
            colorFadeStartTime,
        } = this.state;
        const now = Date.now();
        const elapsed = now - colorFadeStartTime;

        // alpha the interpolation factor
        let t = Math.min(1.0, elapsed / fadeDuration);

        // starting color (current color) and target color (next color)
        const startColor = new Color(backgroundColors[colorIndex]);
        const nextColorIndex = (colorIndex + 1) % backgroundColors.length;
        const targetColor = new Color(backgroundColors[nextColorIndex]);

        const interpolatedColor = new Color().lerpColors(
            startColor,
            targetColor,
            t
        );

        // background color
        this.background = interpolatedColor;
        this.fog.color = interpolatedColor;

        if (t === 1.0) {
            // next fade cycle
            this.state.colorIndex = nextColorIndex;
            this.state.colorFadeStartTime = now;
        }

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
        for (const obj of terrainUpdateList) {
            obj.update(timeStamp, this.terrainController);
        }

        const currTime = Date.now() / 1000;
        const elapsedTime = currTime - this.state.startTime / 1000;
    }

    pause() {
        this.state.paused = true;
        this.state.prevGameSpeed = this.state.gameSpeed;
        this.state.gameSpeed = 0;
    }

    unpause() {
        this.state.paused = false;
        this.state.gameSpeed = this.state.prevGameSpeed;
    }

    getObstacleCollision() {
        const player = this.currentCharacter;
        const playerZPos = player.position.z;
        let playerBoundingBox = new Box3().setFromObject(player);
        if (player.name == 'biker') {
            playerBoundingBox = new Box3().setFromObject(player.element);
        }
        for (const obstacle of this.obstacles) {
            if (
                obstacle.position.z - playerZPos > 5 ||
                obstacle.position.z < playerZPos
            ) {
                continue;
            }
            if (
                obstacle.collidesWith(playerBoundingBox) &&
                !this.obstacles_hit.has(obstacle.uuid)
            ) {
                this.obstacles_hit.add(obstacle.uuid);
                if (this.terrainController.characterPhase == 2) {
                    let dingClone = splashSound.cloneNode();
                    dingClone.play();
                } else if (this.terrainController.characterPhase == 0) {
                    let clone = deerSound.cloneNode();
                    clone.play();
                } else if (this.terrainController.characterPhase == 4) {
                    let squawkClone = squawkSound.cloneNode();
                    squawkClone.play();
                }
                return obstacle;
            }
        }
        return null;
    }

    getRewardCollision() {
        const player = this.currentCharacter;
        const playerZPos = player.position.z;
        let playerBoundingBox = new Box3().setFromObject(player);
        if (player.name == 'biker') {
            playerBoundingBox = new Box3().setFromObject(player.element);
        }
        for (const reward of this.rewards) {
            // if (reward.position.z - playerZPos > 5 || reward.position.z < playerZPos) {
            //     continue;
            // }
            if (
                reward.collidesWith(playerBoundingBox) &&
                !this.rewards_hit.has(reward.uuid)
            ) {
                this.rewards_hit.add(reward.uuid);
                return reward;
            }
        }
        return null;
    }

    characterSwitch(newPhase) {
        let currX = 0;
        if (this.currentCharacter) {
            // remove the old character
            currX = this.currentCharacter.element.position.x;
            this.remove(this.currentCharacter);

            // remove old character from updateList
            const index = this.state.updateList.indexOf(this.currentCharacter);
            if (index > -1) {
                this.state.updateList.splice(index, 1);
            }

            this.currentCharacter = null;
        }

        // new character if new terrain
        let newCharacter = null;
        switch (newPhase) {
            case TerrainPhase.RUNNING:
                newCharacter = new Runner();
                newCharacter.element.position.x = currX;
                break;
            case TerrainPhase.SWIMMING:
                newCharacter = new Swimmer(this);
                newCharacter.element.position.x = currX;
                break;
            case TerrainPhase.BIKING:
                newCharacter = new Biker();
                newCharacter.element.position.x = currX;
                newCharacter.children[0].position.x = currX;
                break;
            default:
                break;
        }

        // add new char to list
        if (newCharacter) {
            this.currentCharacter = newCharacter;
            this.addToUpdateList(this.currentCharacter);
            this.add(this.currentCharacter);
        }

        this.currentPhase = newPhase;
    }

    handleRewardObstacleCollisions() {
        let currRewards = [];
        let currObstacles = [];
        if (this.currentCharacter.name == 'runner') {
            currRewards = this.allRunRewards;
            currObstacles = this.allRunObstacles;
        } else if (this.currentCharacter.name == 'swimmer') {
            // currRewards = this.allSwimRewards;
            // currObstacles = this.allSwimObstacles;
        } else {
            currRewards = this.allBikeRewards;
            currObstacles = this.allBikeObstacles;
        }
        for (const obstacle of currObstacles) {
            for (const reward of currRewards) {
                if (Math.abs(obstacle.position.z - reward.position.z) > 4) {
                    continue;
                }
                const rewardBBox = new Box3().setFromObject(reward);
                if (obstacle.collidesWith(rewardBBox)) {
                    reward.visible = false;
                }
            }
        }
    }

    addSeaCreatures() {
        const dolphinZPositions = [-10, -60, -150, -90, -210, -240];
        let direction = 1;
        for (let i = 0; i < dolphinZPositions.length; i++) {
            const dolphin = new Dolphin(this, 15 * direction, 0, dolphinZPositions[i] + 70);
            this.add(dolphin);
            direction *= -1;
        }

        const fishZPositions = [];
        for (let i = 1; i < 41; i++) {
            fishZPositions.push(-5 * i);
        }
        const fishXPositions = []
        let x = 11.5;
        for (let i = 1; i < 21; i++) {
            fishXPositions.push(x);
            x += 0.5;
        }
        direction = -1;
        for (let i = 0; i < fishZPositions.length; i++) {
            const x = fishXPositions[Math.floor(Math.random() * fishXPositions.length)];
            const dory = new Dory(this, x * direction, -2, fishZPositions[i] + 70);
            this.add(dory);
            direction *= -1;
        }

        direction = 1;
        for (let i = 0; i < fishZPositions.length; i++) {
            const x = fishXPositions[Math.floor(Math.random() * fishXPositions.length)];
            const nemo = new Nemo(this, x * direction, -2, fishZPositions[i] + 55);
            this.add(nemo);
            direction *= -1;
        }
        const rayZPositions = [-10, -60, -150, -90, -210, -240, -20, -40, -200, -120, -140, -170];
        for (let i = 0; i < rayZPositions.length; i++) {
            const x = fishXPositions[Math.floor(Math.random() * fishXPositions.length)];
            const ray = new Stingray(this, x * direction, -4, rayZPositions[i] + 73);
            this.add(ray);
            direction *= -1;
        }

        for (let i = 0; i < rayZPositions.length; i++) {
            const x = fishXPositions[Math.floor(Math.random() * fishXPositions.length)];
            const whale = new Whale(this, x * direction, -3, rayZPositions[i] + 90);
            this.add(whale);
            direction *= -1;
        }
    }
}

export default RunningScene;
