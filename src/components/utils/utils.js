
const obstacleXPositions = [0, 1.7, -1.7];
const sideXPositions = [-6, 6];

function getRandomObstacleX() {
    return obstacleXPositions[Math.floor(Math.random()*3)];
}

function getRandomSideX() {
    return sideXPositions[Math.floor(Math.random() * 2)];
}

export { getRandomObstacleX, getRandomSideX };