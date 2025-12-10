
const obstacleXPositions = [0, 1.7, -1.7];

function getRandomObstacleX() {
    return obstacleXPositions[Math.floor(Math.random()*3)];
}

export { getRandomObstacleX };