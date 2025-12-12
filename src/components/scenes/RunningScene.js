import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper, Box3, TextureLoader, RepeatWrapping} from 'three';
import {
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
} from 'objects';
import { BasicLights } from 'lights';
import { TerrainPhase, obstacleXPositions } from '../config';
import { getRandomObstacleX, getRandomSideX, getRandomRewardX } from '../utils/utils';
import DAYLIGHT from '../../assets/daylight.jpg';
import STARRY from '../../assets/starry_night.jpg';
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
            prevGameSpeed: 0.7,
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

        // add spectators to scene
        for (let i = 0; i < 5; i++) {
            const spectator = new Spectator(this, -6, 10 * (i + 1) - 30);
            this.add(spectator);
        }

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

        // for debugging
        const axesHelper = new AxesHelper(5);
        this.add(axesHelper);
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    addToTerrainUpdateList(object) {
        this.state.terrainUpdateList.push(object);
    }

    update(timeStamp) {
        const { updateList, terrainUpdateList, startTime, skyMode, textureList} = this.state;
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
        console.log(elapsed);

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
        const elapsedTime = currTime - (this.state.startTime / 1000);

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
            if (
                reward.position.z - playerZPos > 5 ||
                reward.position.z < playerZPos
            ) {
                continue;
            }
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
}

export default RunningScene;
