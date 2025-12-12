
const obstacleXPositions = [0, 1.7, -1.7];
const rewardXPositions = [0, 2, -2];
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

export { getRandomObstacleX, getRandomSideX, getRandomRewardX, sinusoid };