let bird = document.getElementById('bird');
let game = document.getElementById('game');
let scoreDiv = document.getElementById('score');
let birdHeight = getComputedStyle(bird).height;
let birdWidth = getComputedStyle(bird).width;
let birdLeft = 80;
bird.style.left = `${birdLeft}px`;
let gameHeight = getComputedStyle(game).height;
let gameWidth = getComputedStyle(game).width;
let pillarWidth = 90;
let score = 0;
birdHeight = Number(birdHeight.slice(0, birdHeight.length - 2));
birdWidth = Number(birdWidth.slice(0, birdWidth.length - 2));

gameHeight = Number(gameHeight.slice(0, gameHeight.length - 2));
gameWidth = Number(gameWidth.slice(0, gameWidth.length - 2));
const gap = 225;
let velocity = 0;
let acc = 0.175;
let gameState = true;
let pillars = [];
let count = 0;
const gameLogic = () => {
    count += 10;
    if (pillars.length > 0) {
        for (let pillarGroup of pillars) {
            let pillarLeft = pillarGroup[0].style.left;
            pillarLeft = Number(pillarLeft.slice(0, pillarLeft.length - 2));
            pillarGroup[0].style.left = `${pillarLeft - 3}px`;
            pillarGroup[1].style.left = `${pillarLeft - 3}px`;
        }
        let left = pillars[0][0].style.left;
        left = Number(left.slice(0, left.length - 2));
        if (left + pillarWidth < 0) {
            pillars.shift();
            score++;
            scoreDiv.textContent = score;
        }
    }

    if (!gameState) {
        clearInterval(physics);
    }
    if (count % 1000 === 0) {
        generatePillar();
    }
    if (pillars.length > 0) {
        checkCollision();
        birdGravity();
    }

};
let physics = setInterval(gameLogic, 10);

const birdGravity = () => {
    velocity += acc;
    let top = getComputedStyle(bird).top;
    top = Number(top.slice(0, top.length - 2));
    if (top + velocity >= gameHeight - birdHeight) {
        window.clearInterval(physics);
        bird.style.top = `${gameHeight - birdHeight - 2}px`;
        gameState = false;
    } else if (top < 0) {
        bird.style.top = '0px';
        velocity = 0;
    } else {
        top += velocity;
        bird.style.top = `${top}px`;
    }
}
const checkCollision = () => {
    let topPillar = pillars[0][0];
    let botPillar = pillars[0][1];
    let birdTop = bird.style.top;
    let topLeft = topPillar.style.left;
    let botLeft = botPillar.style.left;
    let botHeight = botPillar.style.height;
    let topHeight = topPillar.style.height;
    birdTop = Number(birdTop.slice(0, birdTop.length - 2));
    topLeft = Number(topLeft.slice(0, topLeft.length - 2));
    botLeft = Number(botLeft.slice(0, botLeft.length - 2));
    botHeight = Number(botHeight.slice(0, botHeight.length - 2));
    topHeight = Number(topHeight.slice(0, topHeight.length - 2));
    if (Math.abs(birdLeft + birdWidth - botLeft) < 2 && (birdTop + birdHeight > gameHeight - botHeight || birdTop < topHeight)) {
        gameState = false;
    } else if (birdLeft + birdWidth > botLeft && birdLeft < botLeft + pillarWidth && (birdTop + birdHeight > gameHeight - botHeight || birdTop < topHeight)) {
        gameState = false;
    }
};
const generatePillar = () => {
    let topPillar = document.createElement('div');
    let botPillar = document.createElement('div');
    topPillar.className += 'pillar';
    botPillar.className += 'pillar';
    game.appendChild(topPillar);
    game.appendChild(botPillar);
    let heights = [125, 125, 150, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 400, 425, 425];
    let topHeight = heights[Math.floor(Math.random() * heights.length)];
    let botHeight = gameHeight - gap - topHeight;
    topPillar.style.height = `${topHeight}px`;
    topPillar.style.top = '0px';
    botPillar.style.height = `${botHeight}px`;
    botPillar.style.top = `${gameHeight - botHeight}px`;
    topPillar.style.left = `${gameWidth - 90}px`;
    botPillar.style.left = `${gameWidth - 90}px`;
    topPillar.style.width = `${pillarWidth}px`;
    botPillar.style.width = `${pillarWidth}px`;
    pillars.push([topPillar, botPillar]);
};
generatePillar();
// jump
document.addEventListener('keypress', e => {
    if (e.key === ' ') {
        if (!gameState) {
            restartGame();
        } else {
            velocity = -5.7;
        }
    }
});
document.addEventListener('click', e => {
    if (!gameState) {
        restartGame();
    } else {
        velocity = -5.7;
    }
});
restartGame = () => {
    score = 0;
    physics = setInterval(gameLogic, 10);
    bird.style.top = `${gameHeight / 2 - birdHeight / 2}px`;
    velocity = -1;
    gameState = true;
    for (let pillarGroup of pillars) {
        console.log(pillarGroup);
        game.removeChild(pillarGroup[0]);
        game.removeChild(pillarGroup[1]);
    }
    pillars = [];

};