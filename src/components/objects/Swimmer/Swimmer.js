import * as THREE from 'three';
import {
    Group,
    BoxGeometry,
    Mesh,
    MeshToonMaterial,
    VertexColors,
    BufferGeometry,
} from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import dive from '../../../sounds/finaldive.wav';

const diveSound = new Audio(dive);
diveSound.load();

const Colors = {
    cherry: 0xe35d6a,
    blue: 0x1560bd,
    white: 0xd8d0d1,
    black: 0x000000,
    brown: 0x59332e,
    peach: 0xedba9d,
    yellow: 0xffff00,
    olive: 0x556b2f,
    purple: 0xaf69ee,
    lightblue: 0x6693f5,
};
const deg2Rad = Math.PI / 180;

class Swimmer extends Group {
    constructor(parent) {
        super();

        // init state (nothing for now)
        // this.state = {
        //     running: true,
        // };

        this.Character(parent);
        this.name = 'swimmer';
    }

    sinusoid(frequency, minimum, maximum, phase) {
        var amplitude = 0.5 * (maximum - minimum);
        var angularFrequency = 2 * Math.PI * frequency;
        var phaseRadians = (phase * Math.PI) / 180;
        var currTimeInSecs = new Date() / 1000;
        var offset =
            amplitude *
            Math.sin(angularFrequency * currTimeInSecs + phaseRadians);
        var average = (minimum + maximum) / 2;
        return average + offset;
    }

    Character(parent) {
        // Explicit binding of this even in changing contexts.
        var self = this;

        // Character defaults.
        this.skinColor = Colors.peach;
        this.hairColor = Colors.brown;
        this.shirtColor = Colors.blue;
        this.shortsColor = Colors.blue;
        this.stepFreq = 1.5;
        this.diveHeight = -2; // controls how high the character dives

        // maybe change this based on parent.state.gamespeed?
        this.jumpDuration = 0.7; // Controls how long the jump lasts (in seconds)

        // Initialize the character.
        init();

        /**
         * Builds the character in depth-first order. The parts of are
         * modelled by the following object hierarchy:
         *
         * - character (this.element)
         *    - head
         *       - face
         *       - hair
         *    - torso
         *    - leftArm
         *       - leftLowerArm
         *    - rightArm
         *       - rightLowerArm
         *    - leftLeg
         *       - rightLowerLeg
         *    - rightLeg
         *       - rightLowerLeg
         *
         */
        function init() {
            self.face = self.createBox(100, 100, 60, self.skinColor, 0, 0, 0);
            self.hair = self.createBox(105, 20, 65, self.hairColor, 0, 50, 0);
            self.head = self.createGroup(0, 260, -25);
            self.head.add(self.face);
            self.head.add(self.hair);

            // pigtail stuff
            self.rightPigtail1 = self.createCylinder(
                15,
                15 * 0.8,
                40,
                8,
                self.hairColor,
                70,
                50,
                0
            );

            self.rightPigtail2 = self.createCylinder(
                15 * 0.8,
                5 * 0.8,
                40 * 1.5,
                8,
                self.hairColor,
                70,
                50 - 50,
                0
            );

            self.leftPigtail1 = self.createCylinder(
                15,
                15 * 0.8,
                40,
                8,
                self.hairColor,
                -70,
                50,
                0
            );

            self.leftPigtail2 = self.createCylinder(
                15 * 0.8,
                5 * 0.8,
                40 * 1.5,
                8,
                self.hairColor,
                -70,
                50 - 50,
                0
            );

            self.head.add(self.rightPigtail1);
            self.head.add(self.rightPigtail2);
            self.head.add(self.leftPigtail1);
            self.head.add(self.leftPigtail2);

            self.torso = self.createBox(
                150,
                190,
                40,
                self.shirtColor,
                0,
                100,
                0
            );

            self.leftLowerArm = self.createLimb(
                20,
                120,
                30,
                self.skinColor,
                0,
                -170,
                0
            );
            self.leftArm = self.createLimb(
                30,
                140,
                40,
                self.skinColor,
                -100,
                190,
                -10
            );
            self.leftArm.add(self.leftLowerArm);

            self.rightLowerArm = self.createLimb(
                20,
                120,
                30,
                self.skinColor,
                0,
                -170,
                0
            );
            self.rightArm = self.createLimb(
                30,
                140,
                40,
                self.skinColor,
                100,
                190,
                -10
            );
            self.rightArm.add(self.rightLowerArm);

            self.leftLowerLeg = self.createLimb(
                40,
                200,
                40,
                self.skinColor,
                0,
                -100,
                0
            );
            self.leftLeg = self.createLimb(
                50,
                80,
                50,
                self.shortsColor,
                -50,
                -10,
                30
            );
            self.leftLeg.add(self.leftLowerLeg);

            self.rightLowerLeg = self.createLimb(
                40,
                200,
                40,
                self.skinColor,
                0,
                -100,
                0
            );
            self.rightLeg = self.createLimb(
                50,
                80,
                50,
                self.shortsColor,
                50,
                -10,
                30
            );
            self.rightLeg.add(self.rightLowerLeg);

            self.element = self.createGroup(0, 0, -300);
            self.element.add(self.head);
            self.element.add(self.torso);
            self.element.add(self.leftArm);
            self.element.add(self.rightArm);
            self.element.add(self.leftLeg);
            self.element.add(self.rightLeg);

            self.isDiving = false;
            self.isSwitchingLeft = false;
            self.isSwitchingRight = false;
            self.currentLane = 0;
            self.queuedActions = [];
            self.runningStartTime = new Date() / 1000;

            self.element.position.x = 0;
            self.element.position.z = 1;
            self.element.position.y = -7;

            const scaleFactor = 0.004;
            self.element.scale.set(scaleFactor, scaleFactor, scaleFactor);
            self.add(self.element);

            // rotate her so that she looks like she's actually swimming
            self.rotateX(-Math.PI / 2);

        }

        this.update = function () {
            var currentTime = new Date() / 1000;

            // Apply actions to the character if none are currently being
            // carried out.
            if (
                !self.isDiving &&
                !self.isSwitchingLeft &&
                !self.isSwitchingRight &&
                self.queuedActions.length > 0
            ) {
                switch (self.queuedActions.shift()) {
                    case 'ArrowDown':
                        self.isDiving = true;
                        self.diveStartTime = new Date() / 1000;
                        break;
                    case 'ArrowLeft':
                        self.isSwitchingLeft = true;
                        break;
                    case 'ArrowRight':
                        self.isSwitchingRight = true;
                        break;
                }
            }

            // If the character is jumping, update the height of the character.
            // Otherwise, the character continues running.
            if (self.isDiving) {
                var jumpClock = currentTime - self.diveStartTime;
                self.element.position.z =
                    self.diveHeight *
                    Math.sin((1 / self.jumpDuration) * Math.PI * jumpClock);

                // diving arms
                self.leftArm.rotation.x = -180 * deg2Rad;
                self.rightArm.rotation.x = -180 * deg2Rad;

                self.leftLowerArm.rotation.z = Math.PI / 12;
                self.rightLowerArm.rotation.z = -Math.PI / 12;
                self.leftArm.rotation.z = Math.PI / 12;
                self.rightArm.rotation.z = -Math.PI / 12;

                self.leftLowerArm.rotation.x = 0;
                self.rightLowerArm.rotation.x = 0;

                self.leftLeg.rotation.x = 0;
                self.rightLeg.rotation.x = 0;

                if (jumpClock > self.jumpDuration) {
                    self.isDiving = false;
                    self.runningStartTime += self.jumpDuration;
                    // back to the OG position
                    self.element.position.z = 1;
                }
            } else if (!self.parent.state.paused) {
                self.leftLowerArm.rotation.z = 0;
                self.rightLowerArm.rotation.z = 0;
                self.leftArm.rotation.z = 0;
                self.rightArm.rotation.z = 0;
                
                var runningClock = currentTime - self.runningStartTime;
                var swimFreq = 1.0;

                // body rotation
                // side to side breathing
                self.element.rotation.y =
                    self.sinusoid(
                        swimFreq / 2, // Half the frequency of the arms
                        -5,
                        5,
                        90,
                        runningClock
                    ) * deg2Rad;

                // head rotation
                self.head.rotation.z =
                    self.sinusoid(swimFreq, -5, 5, 0, runningClock) * deg2Rad;

                // torso rotation
                self.torso.rotation.x =
                    self.sinusoid(swimFreq, -3, 3, 0, runningClock) * deg2Rad;

                // FREESTYLE STROKE
                // left arm
                self.leftArm.rotation.x =
                    self.sinusoid(swimFreq, -160, 160, 180, runningClock) * // 180 deg phase shift (opposite the right arm)
                    deg2Rad;

                // right arm
                self.rightArm.rotation.x =
                    self.sinusoid(swimFreq, -160, 160, 0, runningClock) * // No phase shift
                    deg2Rad;

                // loewr arms (less movement here)
                self.leftLowerArm.rotation.x = 0;
                self.rightLowerArm.rotation.x = 0;

                // kicking (flutter kicking) -> down n up
                var kickFreq = 3;

                // left leg
                self.leftLeg.rotation.x =
                    self.sinusoid(kickFreq, -20, 20, 0, runningClock) * deg2Rad;

                // right leg
                self.rightLeg.rotation.x =
                    self.sinusoid(kickFreq, -20, 20, 180, runningClock) *
                    deg2Rad;

                self.leftLowerLeg.rotation.x =
                    self.sinusoid(kickFreq, -10, 30, 0, runningClock) * deg2Rad;

                self.rightLowerLeg.rotation.x =
                    self.sinusoid(kickFreq, -10, 30, 180, runningClock) *
                    deg2Rad;

                // If the character is not jumping, it may be switching lanes.
                if (self.isSwitchingLeft) {
                    if (self.element.position.x <= -2.3) {
                        self.element.position.x = -2.3;
                    } else {
                        self.element.position.x -= 2.3;
                    }
                    self.isSwitchingLeft = false;
                }
                if (self.isSwitchingRight) {
                    if (self.element.position.x >= 2.3) {
                        self.element.position.x = 2.3;
                    } else {
                        self.element.position.x += 2.3;
                    }
                    self.isSwitchingRight = false;
                }
            }
        };

        /**
         * Handles character activity when the left key is pressed.
         */
        this.onLeftKeyPressed = function () {
            self.queuedActions.push('ArrowLeft');
        };

        /**
         * Handles character activity when the up key is pressed.
         */
        this.onDownKeyPressed = function () {
            self.queuedActions.push('ArrowDown');
            const diveClone = diveSound.cloneNode();
            diveClone.play();
        };

        /**
         * Handles character activity when the right key is pressed.
         */
        this.onRightKeyPressed = function () {
            self.queuedActions.push('ArrowRight');
        };

        /**
         * Handles character activity when the game is paused.
         */
        this.onPause = function () {
            self.pauseStartTime = new Date() / 1000;
        };

        /**
         * Handles character activity when the game is unpaused.
         */
        this.onUnpause = function () {
            var currentTime = new Date() / 1000;
            var pauseDuration = currentTime - self.pauseStartTime;
            self.runningStartTime += pauseDuration;
            if (self.isDiving) {
                self.diveStartTime += pauseDuration;
            }
        };
    }

    createLimb(dx, dy, dz, color, x, y, z) {
        var limb = this.createGroup(x, y, z); // FIX: Use this.createGroup
        var offset = -1 * (Math.max(dx, dz) / 2 + dy / 2);
        var limbBox = this.createBox(dx, dy, dz, color, 0, offset, 0);
        limb.add(limbBox);
        return limb;
    }

    createGroup(x, y, z) {
        var group = new THREE.Group();
        group.position.set(x, y, z);
        return group;
    }

    createBox(dx, dy, dz, color, x, y, z, notFlatShading) {
        var geom = new THREE.BoxGeometry(dx, dy, dz);
        var mat = new THREE.MeshPhongMaterial({
            color: color,
            flatShading: notFlatShading != true,
        });
        var box = new THREE.Mesh(geom, mat);
        box.castShadow = true;
        box.receiveShadow = false;
        box.position.set(x, y, z);
        return box;
    }

    createCylinder(
        radiusTop,
        radiusBottom,
        height,
        radialSegments,
        color,
        x,
        y,
        z
    ) {
        var geom = new THREE.CylinderGeometry(
            radiusTop,
            radiusBottom,
            height,
            radialSegments
        );
        var mat = new THREE.MeshPhongMaterial({
            color: color,
            flatShading: true,
        });
        var cylinder = new THREE.Mesh(geom, mat);
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;
        cylinder.position.set(x, y, z);
        return cylinder;
    }

    resetParams() {
        this.position.y = 1.4;
        this.collected = false;
    }
}

export default Swimmer;
