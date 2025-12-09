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

const Colors = {
    cherry: 0xe35d6a,
    blue: 0x1560bd,
    white: 0xd8d0d1,
    black: 0x000000,
    brown: 0x59332e,
    peach: 0xffdab9,
    yellow: 0xffff00,
    olive: 0x556b2f,
};
const deg2Rad = Math.PI / 180;

class Runner extends Group {
    constructor(parent) {
        super();

        // init state (nothing for now)
        // this.state = {
        //     running: true,
        // };

        this.Character();
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

    Character() {
        // Explicit binding of this even in changing contexts.
        var self = this;

        // Character defaults.
        this.skinColor = Colors.brown;
        this.hairColor = Colors.black;
        this.shirtColor = Colors.yellow;
        this.shortsColor = Colors.olive;
        this.stepFreq = 2;

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
                -200,
                0
            );
            self.leftLeg = self.createLimb(
                50,
                170,
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
                -200,
                0
            );
            self.rightLeg = self.createLimb(
                50,
                170,
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

            const scaleFactor = 0.004;
            self.element.scale.set(scaleFactor, scaleFactor, scaleFactor);
            self.add(self.element);
        }

        this.update = function () {
            // self.element.rotation.y += 0.02;
            self.element.position.x = 0;
            self.element.position.z = 6;
            self.element.position.y = 1.2;
            // self.element.position.y = self.sinusoid(
            //     2 * self.stepFreq,
            //     0,
            //     20,
            //     0
            // );
            self.head.rotation.x =
                self.sinusoid(2 * self.stepFreq, -10, -5, 0) * deg2Rad;
            self.torso.rotation.x =
                self.sinusoid(2 * self.stepFreq, -10, -5, 180) * deg2Rad;
            self.leftArm.rotation.x =
                self.sinusoid(self.stepFreq, -70, 50, 180) * deg2Rad;
            self.rightArm.rotation.x =
                self.sinusoid(self.stepFreq, -70, 50, 0) * deg2Rad;
            self.leftLowerArm.rotation.x =
                self.sinusoid(self.stepFreq, 70, 140, 180) * deg2Rad;
            self.rightLowerArm.rotation.x =
                self.sinusoid(self.stepFreq, 70, 140, 0) * deg2Rad;
            self.leftLeg.rotation.x =
                self.sinusoid(self.stepFreq, -20, 80, 0) * deg2Rad;
            self.rightLeg.rotation.x =
                self.sinusoid(self.stepFreq, -20, 80, 180) * deg2Rad;
            self.leftLowerLeg.rotation.x =
                self.sinusoid(self.stepFreq, -130, 5, 240) * deg2Rad;
            self.rightLowerLeg.rotation.x =
                self.sinusoid(self.stepFreq, -130, 5, 60) * deg2Rad;
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

    resetParams() {
        this.position.y = 1.4;
        this.collected = false;
    }

    // onCollision() {
    //     if (!this.collected) {
    //         this.collected = true;
    //         const spin = new TWEEN.Tween(this.rotation).to(
    //             { y: this.rotation.y + 2 * Math.PI },
    //             200
    //         );
    //         const jumpUp = new TWEEN.Tween(this.position)
    //             .to({ y: this.position.y + 2 }, 200)
    //             .easing(TWEEN.Easing.Quadratic.Out);
    //         const fallDown = new TWEEN.Tween(this.position)
    //             .to({ y: -1 }, 300)
    //             .easing(TWEEN.Easing.Quadratic.In);
    //         const resetPos = new TWEEN.Tween(this.position).to(
    //             { z: -(this.parent.fog.far + 50 * Math.random()) },
    //             100
    //         );

    //         // Reset position after jumping up and down
    //         jumpUp.onComplete(() => fallDown.start());
    //         fallDown.onComplete(() => resetPos.start());
    //         resetPos.onComplete(() => this.resetParams());

    //         // Start animation
    //         jumpUp.start();
    //         spin.start();
    //     }
    // }
}

export default Runner;
