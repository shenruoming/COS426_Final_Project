import * as THREE from 'three';
import { Group, Box3 } from 'three';
import { sinusoid, createCylinder, createBox, createGroup, createLimb } from '../../utils/utils';
import { TerrainPhase, CAMERA_Z_POS, CAMERA_OFFSET } from '../../config';

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

class Spectator extends Group {
    constructor(parent, x, y, z) {
        super();

        // init state (nothing for now)
        this.state = {
            inScene: true,
            path: parent.getObjectByName('swimmingPath'),
        };

        this.terrainController = parent.terrainController;

        this.Character(x, y, z);
        this.name = 'spectator';

        // Add self to parent's update list
        parent.addToUpdateList(this);
    }

    update(timeStamp) {
        let inScene = this.state.inScene;
        this.position.y = sinusoid(0.3, 0.5, 1.2, 0);
        if (this.terrainController.characterPhase != TerrainPhase.RUNNING) {
            if (inScene) {
                this.visible = false;
                this.state.inScene = false;
            }
        } else {
            if (!inScene) {
                this.visible = true;
                this.state.inScene = true;
            }
            this.position.z += this.parent.state.gameSpeed;
            if (this.position.z > CAMERA_Z_POS + CAMERA_OFFSET) {
                this.position.z -= 300;
            }
            if (this.position.z < this.getPathEnd()) {
                this.visible = false;
            }
        }
    }
    getPathEnd() {
        let bbox = new Box3().setFromObject(this.state.path.children[0]);
        return bbox.max.z + 10;
    }

    Character(x, y, z) {
        // Explicit binding of this even in changing contexts.
        var self = this;

        // Character defaults.
        this.skinColor = Colors.peach;
        this.hairColor = Colors.brown;
        this.shirtColor = Colors.purple;
        this.shortsColor = Colors.lightblue;
        this.stepFreq = 2;

        // Initialize the character.
        init();

        self.element.position.x = x;
        self.element.position.z = z;
        self.element.position.y = y;
        self.element.rotation.y = - Math.PI / 2;

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

            self.torso = createBox(
                150,
                190,
                40,
                self.shirtColor,
                0,
                100,
                0
            );

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
                30,
                170,
                50,
                self.shortsColor,
                -50,
                -10,
                30
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
                30,
                170,
                50,
                self.shortsColor,
                50,
                -10,
                30
            );
            self.rightLeg.add(self.rightLowerLeg);

            self.element = createGroup(0, 0, -300);
            self.element.add(self.head);
            self.element.add(self.torso);
            self.element.add(self.leftArm);
            self.element.add(self.rightArm);
            self.element.add(self.leftLeg);
            self.element.add(self.rightLeg);

            const scaleFactor = 0.007;
            self.element.scale.set(scaleFactor, scaleFactor, scaleFactor);
            self.add(self.element);

        }
    }
}

export default Spectator;
