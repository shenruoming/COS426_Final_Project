import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper } from 'three';
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
<<<<<<< Updated upstream
=======
    Deer,
    Shark,
    Bird,
>>>>>>> Stashed changes
} from 'objects';
import { BasicLights } from 'lights';
import { TerrainPhase } from '../config';

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
            prevGameSpeed: 1,
            paused: true,
<<<<<<< Updated upstream
=======
            gameOver: false,
>>>>>>> Stashed changes
        };

        this.gameOver = false;

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // add lights to scene
        const lights = new BasicLights();
        this.add(lights);

        this.terrainController = new TerrainController();

        // add player to scene: runner, swimmer, biker
        // const runner = new Runner();
        // this.addToUpdateList(runner);
        // this.add(runner);

        // const swimmer = new Swimmer();
        // this.addToUpdateList(swimmer);
        // this.add(swimmer);

        const biker = new Biker();
        this.addToUpdateList(biker);
        this.add(biker);

        // Add ground to scene: running
        const runningPath = new RunningPath(this);
        const grass = new Grass(this);
        this.add(runningPath, grass);

        // add spectators to scene
        for (let i = 0; i < 5; i++) {
            const spectator = new Spectator(this, -6, 10 * (i + 1) - 30);
            this.add(spectator);
        }

        // add water to scene: swimming
        const swimmingPath = new SwimmingPath(this);
        const ocean = new Ocean(this);
        this.add(swimmingPath, ocean);

        const bikingPath = new BikingPath(this);
        const mountains = new Mountains(this);
        this.add(bikingPath, mountains);

<<<<<<< Updated upstream
=======
        // Add running obstacles to scene
        const deerZPositions = [
            -20, -40, -70, -90, -110, -80, -50, -100, -140, -160, -180, -210,
            -240, -270, -240,
        ];
        for (let i = 0; i < 14; i++) {
            const x = getRandomObstacleX();
            const deer = new Deer(this, x, 1.8, deerZPositions[i]);
            this.add(deer);
            this.obstacles.push(deer);
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
            direction *= -1;
        }

>>>>>>> Stashed changes
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
        const { updateList, terrainUpdateList } = this.state;
        this.terrainController.updateTerrain();

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
        for (const obj of terrainUpdateList) {
            obj.update(timeStamp, this.terrainController);
        }
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
<<<<<<< Updated upstream
=======

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
                return obstacle;
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
>>>>>>> Stashed changes
}

export default RunningScene;
