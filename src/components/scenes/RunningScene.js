import * as Dat from 'dat.gui';
import { Scene, Color, AxesHelper, Box3 } from 'three';
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
    Shark
} from 'objects';
import { BasicLights } from 'lights';
import { TerrainPhase, obstacleXPositions } from '../config';
import { getRandomObstacleX } from '../utils/utils';

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
            gameOver: false
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // add lights to scene
        const lights = new BasicLights();
        this.add(lights);

        this.terrainController = new TerrainController();

        this.obstacles_hit = new Set();

        // add player to scene: start with runner
        // const runner = new Runner();
        // this.addToUpdateList(runner);
        // this.add(runner);

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

        // Add running obstacles to scene
        // const deerZPositions = [-30, -50, -80, -100, -120, -80, -50, -100, -120, -150, -170, -180];
        const deerZPositions = [-30, -50, -80, -100, -120, -80, -50, -100];
        for (let i = 0; i < 8; i++) {
            const x = getRandomObstacleX();
            const deer = new Deer(this, x, 1.8, deerZPositions[i]);
            this.add(deer)
            this.obstacles.push(deer);
        }

        // add water to scene: swimming
        const swimmingPath = new SwimmingPath(this);
        const ocean = new Ocean(this);
        this.add(swimmingPath, ocean);

        // add shark
        // const shark = new Shark(this, 0, 3, -5);
        // this.add(shark);

        // const swimmer = new Swimmer();
        // swimmer.position.x;
        // this.addToUpdateList(swimmer);
        // this.add(swimmer);

        const bikingPath = new BikingPath(this);
        const mountains = new Mountains(this);
        this.add(bikingPath, mountains);

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

        // for new terrain... switch character
        if (this.terrainController.characterPhase !== this.currentPhase) {
            this.characterSwitch(this.terrainController.characterPhase);
        }

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

    getObstacleCollision() {
        const player = this.currentCharacter;
        const playerZPos = player.position.z;
        const playerBoundingBox = new Box3().setFromObject(player);
        for (const obstacle of this.obstacles) {
            if (obstacle.position.z - playerZPos > 5 || obstacle.position.z < playerZPos) {
                continue;
            }
            if (obstacle.collidesWith(playerBoundingBox) && !this.obstacles_hit.has(obstacle.uuid)) {
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
                newCharacter = new Swimmer();
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
}

export default RunningScene;
