import * as THREE from 'three';
import { Group, Box3 } from 'three';
import {
    sinusoid,
    createCylinder,
    createBox,
    createGroup,
    createLimb,
} from '../../utils/utils';
import { TerrainPhase, CAMERA_Z_POS, CAMERA_OFFSET } from '../../config';

const Colors = {
    cherry: 0xe35d6a,
    blue: 0x1560bd,
    black: 0x000000,
    white: 0xd8d0d1,
    brown: 0x59332e,
    peach: 0xedba9d,
    yellow: 0xffff00,
    olive: 0x556b2f,
    purple: 0xaf69ee,
    lightblue: 0x6693f5,
    orange: 0xffba00,
    neon: 0x82ff82,
    pink: 0xff4dd9,
    turquoise: 0x4dff8e,
    beige: 0xe0ac69,
};

const clothescolors = [
    Colors.cherry,
    Colors.blue,
    Colors.white,
    Colors.yellow,
    Colors.olive,
    Colors.purple,
    Colors.orange,
    Colors.neon,
    Colors.pink,
    Colors.turquoise,
];

const skintones = [Colors.brown, Colors.peach, Colors.beige];
const hairColors = [Colors.brown, Colors.yellow, Colors.black, Colors.cherry];

const deg2Rad = Math.PI / 180;

function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * clothescolors.length);
    return clothescolors[randomIndex];
}
function getRandomSkin() {
    const randomIndex = Math.floor(Math.random() * skintones.length);
    return skintones[randomIndex];
}
function getRandomHair() {
    const randomIndex = Math.floor(Math.random() * hairColors.length);
    return hairColors[randomIndex];
}

class Spectator extends Group {
    constructor(parent, x, y, z, side) {
        super();

        // init state (nothing for now)
        this.state = {
            inScene: true,
            path: parent.getObjectByName('swimmingPath'),
        };

        this.jumpState = {
            frequency: 4.0,
            maxHeight: 0.9,
            baseY: y,
            side: side,
            maxKneeBend: 30 * deg2Rad,
            maxArmSwing: 20 * deg2Rad,
            timeOffset: Math.random() * 1000,
        };

        this.terrainController = parent.terrainController;

        this.Character(x, y, z);
        this.name = 'spectator';

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(timeStamp) {
        let inScene = this.state.inScene;
        if (this.terrainController.characterPhase != TerrainPhase.RUNNING) {
            if (inScene) {
                this.element.visible = false;
                this.state.inScene = false;
            }
            return;
        }

        // generate spectator
        if (!inScene) {
            this.element.visible = true;
            this.state.inScene = true;
            this.element.position.z -= 100;
        }

        this.jump(timeStamp);
        this.element.position.z += this.parent.state.gameSpeed;
        if (this.element.position.z > CAMERA_Z_POS + CAMERA_OFFSET) {
            this.element.position.z -= 300;

            if (this.element.position.z < this.getPathEnd()) {
                this.element.visible = false;
            }
        }
    }

    jump(timeStamp) {
        const {
            frequency,
            maxHeight,
            baseY,
            side,
            maxKneeBend,
            maxArmSwing,
            timeOffset,
        } = this.jumpState;

        const time = (timeStamp / 1000 + timeOffset) * frequency;

        // y position of jump and prevent sinking in ground
        const jumpFactor = Math.abs(Math.sin(time));
        this.position.y = baseY + jumpFactor * maxHeight;

        // lower leg bending
        const kneeBend = jumpFactor * maxKneeBend;
        if (side == 6) {
            this.leftLowerLeg.rotation.x = kneeBend;
            this.rightLowerLeg.rotation.x = kneeBend;
        } else if (side == -6) {
            this.leftLowerLeg.rotation.x = -kneeBend;
            this.rightLowerLeg.rotation.x = -kneeBend;
        }

        // arms swing
        const armSwing = Math.cos(time) * maxArmSwing;

        // rotating arms swinging
        this.leftArm.rotation.z = -10 * deg2Rad + armSwing;
        this.rightArm.rotation.z = 10 * deg2Rad - armSwing;

        this.leftArm.rotation.x = -180 * deg2Rad + Math.sin(time * 0.5) * 0.3;
        this.rightArm.rotation.x = -180 * deg2Rad - Math.sin(time * 0.5) * 0.3;
    }

    getPathEnd() {
        let bbox = new Box3().setFromObject(this.state.path.children[0]);
        return bbox.max.z + 10;
    }

    Character(x, y, z) {
        // Explicit binding of this even in changing contexts.
        var self = this;

        // Character defaults.
        this.skinColor = getRandomSkin();
        this.hairColor = getRandomHair();
        this.shirtColor = getRandomColor();
        this.shortsColor = getRandomColor();
        this.stepFreq = 2;

        // Initialize the character.
        init();

        self.element.position.x = x;
        self.element.position.z = z;
        self.element.position.y = y;
        self.element.rotation.y = -Math.PI / 2;

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
            self.face = createBox(100, 100, 60, self.skinColor, 0, 0, 0);
            self.hair = createBox(105, 20, 65, self.hairColor, 0, 50, 0);
            self.head = createGroup(0, 260, -25);
            self.head.add(self.face);
            self.head.add(self.hair);

            // pigtail stuff
            self.rightPigtail1 = createCylinder(
                15,
                15 * 0.8,
                40,
                8,
                self.hairColor,
                70,
                50,
                0
            );

            self.rightPigtail2 = createCylinder(
                15 * 0.8,
                5 * 0.8,
                40 * 1.5,
                8,
                self.hairColor,
                70,
                50 - 50,
                0
            );

            self.leftPigtail1 = createCylinder(
                15,
                15 * 0.8,
                40,
                8,
                self.hairColor,
                -70,
                50,
                0
            );

            self.leftPigtail2 = createCylinder(
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

            self.torso = createBox(150, 190, 40, self.shirtColor, 0, 100, 0);

            self.leftLowerArm = createLimb(
                20,
                120,
                30,
                self.skinColor,
                0,
                -170,
                0
            );
            self.leftArm = createLimb(
                30,
                140,
                40,
                self.skinColor,
                -100,
                190,
                -10
            );
            self.leftArm.add(self.leftLowerArm);

            self.rightLowerArm = createLimb(
                20,
                120,
                30,
                self.skinColor,
                0,
                -170,
                0
            );
            self.rightArm = createLimb(
                30,
                140,
                40,
                self.skinColor,
                100,
                190,
                -10
            );
            self.rightArm.add(self.rightLowerArm);

            self.leftArm.rotation.x = -180 * deg2Rad;
            self.rightArm.rotation.x = -180 * deg2Rad;
            self.leftArm.rotation.z = -10 * deg2Rad;
            self.rightArm.rotation.z = 10 * deg2Rad;

            self.leftLowerLeg = createLimb(
                30,
                200,
                40,
                self.skinColor,
                0,
                -200,
                0
            );
            self.leftLeg = createLimb(
                40,
                170,
                50,
                self.shortsColor,
                -50,
                20,
                5
            );
            self.leftLeg.add(self.leftLowerLeg);

            self.rightLowerLeg = createLimb(
                30,
                200,
                40,
                self.skinColor,
                0,
                -200,
                0
            );
            self.rightLeg = createLimb(
                40,
                170,
                50,
                self.shortsColor,
                50,
                20,
                5
            );
            self.rightLeg.add(self.rightLowerLeg);

            self.element = createGroup(0, 0, -300);
            self.element.add(self.head);
            self.element.add(self.torso);
            self.element.add(self.leftArm);
            self.element.add(self.rightArm);
            self.element.add(self.leftLeg);
            self.element.add(self.rightLeg);

            const scaleFactor = 0.005;
            self.element.scale.set(scaleFactor, scaleFactor, scaleFactor);
            self.add(self.element);
        }
    }
}

export default Spectator;
