import * as THREE from 'three';
const obstacleXPositions = [0, 1.7, -1.7];
const rewardXPositions = [0, 1, -1];
const sideXPositions = [-6, 6];

function getRandomObstacleX() {
    return obstacleXPositions[Math.floor(Math.random()*3)];
}

function getRandomSideX() {
    return sideXPositions[Math.floor(Math.random() * 2)];
}

function getRandomRewardX() {
    return rewardXPositions[Math.floor(Math.random()*3)];
}


function sinusoid(frequency, minimum, maximum, phase) {
    const amplitude = 0.5 * (maximum - minimum);
    const angularFrequency = 2 * Math.PI * frequency;
    const phaseRadians = (phase * Math.PI) / 180;
    const currTimeInSecs = new Date() / 1000;
    const offset =
        amplitude *
        Math.sin(angularFrequency * currTimeInSecs + phaseRadians);
    const average = (minimum + maximum) / 2;
    return average + offset;
}

function createCylinder(
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

function createBox(dx, dy, dz, color, x, y, z, notFlatShading) {
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

function createGroup(x, y, z) {
    var group = new THREE.Group();
    group.position.set(x, y, z);
    return group;
}

function createLimb(dx, dy, dz, color, x, y, z) {
    var limb = createGroup(x, y, z); // FIX: Use this.createGroup
    var offset = -1 * (Math.max(dx, dz) / 2 + dy / 2);
    var limbBox = createBox(dx, dy, dz, color, 0, offset, 0);
    limb.add(limbBox);
    return limb;
}

export { getRandomObstacleX, getRandomSideX, getRandomRewardX, sinusoid, createCylinder, createBox, createGroup, createLimb };