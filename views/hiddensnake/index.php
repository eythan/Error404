<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NIRD - Résistance Numérique</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=VT323&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="views/hiddensnake/styleGlobal.css">
    <style>
    html, body {
        height: 100%;
        min-height: 100vh;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        overflow: hidden;
    }
    body {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        width: 100vw;
    }
    .container {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 0;
        height: 100vh;
        box-sizing: border-box;
        overflow: hidden;
    }
    #game-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100vw;
        height: 100vh;
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(44,0,80,0.85);
        z-index: 1000;
    }
    #game-ui {
        margin-bottom: 10px;
    }
    #snakeCanvas {
        max-width: 90vw;
        max-height: 60vh;
        width: 400px;
        height: 400px;
        background: #050510;
        border-radius: 8px;
        box-shadow: 0 0 20px #bc13fe44;
    }
    @media (max-width: 600px) {
        #snakeCanvas {
            width: 90vw;
            height: 50vw;
            max-width: 90vw;
            max-height: 50vw;
        }
        .container {
            padding: 10px;
        }
    }
    </style>
</head>
<body>
    <?php include 'views/layouts/header.php'; ?>
    <div class="container">
        <h2>NIRD - Résistance Numérique</h2>
        <p>
            Face à ce <span class="highlight">Goliath numérique</span>, l’École peut devenir un 
            village résistant, ingénieux, autonome et créatif, à 
            l’image du célèbre village d’Astérix.<br>
            C’est précisément l’ambition de la démarche NIRD : 
            permettre aux établissements scolaires d’adopter 
            progressivement un Numérique Inclusif, 
            Responsable et Durable, en redonnant du 
            <span class="highlight">pouvoir d’agir</span> aux équipes éducatives et en renforçant leur 
            autonomie technologique.
        </p>
        <div class="cta-box">
            <p style="font-size: 1.1rem; color: var(--neon-blue);">
                >> Initialisation du protocole d'aide...<br>
                >> Entrer les commandes pour réduire la dépendance... (code secret requis, trouvez les indices dans la)
            </p>
        </div>
    </div>
    <div id="game-overlay" style="display:none;">
        <div id="game-ui">
            <div id="game-title">SYSTEM HACKED: SNAKE PROTOCOL</div>
            <div id="score-board">SCORE: <span id="score">0</span></div>
            <div id="key-board">Dernière touche : <span id="last-key">-</span></div>
            <div style="margin:10px 0;">
                <label for="walls-toggle" style="color:#fff;">Murs : </label>
                <button id="walls-toggle" class="action-button">Activer</button>
            </div>
        </div>
        <canvas id="snakeCanvas" width="400" height="400"></canvas>
        <button id="close-btn" onclick="closeGame()">FERMER LA SIMULATION</button>
    </div>
    <script>
const secretCode = ['d', 'r', 'i', 'n'];
let inputSequence = [];
let gameRunning = false;
let gameLoop; 
let wallsEnabled = true;
const wallsToggleBtn = document.getElementById('walls-toggle');
wallsToggleBtn.addEventListener('click', function() {
    wallsEnabled = !wallsEnabled;
    wallsToggleBtn.textContent = wallsEnabled ? 'Activer' : 'Désactiver';
});
let lastKeySpan = document.getElementById('last-key');

window.addEventListener('keydown', (e) => {
    inputSequence.push(e.key.toLowerCase());
    if (inputSequence.length > secretCode.length) {
        inputSequence.shift();
    }
    if (JSON.stringify(inputSequence) === JSON.stringify(secretCode)) {
        activateGame();
        inputSequence = [];
    }
    lastKeySpan.textContent = e.key;
});

function activateGame() {
    const overlay = document.getElementById('game-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        document.body.classList.add('glitch-active');
        setTimeout(() => document.body.classList.remove('glitch-active'), 500);
        if (!gameRunning) {
            initGame();
        }
    }
}

function closeGame() {
    document.getElementById('game-overlay').style.display = 'none';
    gameRunning = false;
    clearInterval(gameLoop);
    inputSequence = [];
}

const canvas = document.getElementById("snakeCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
if (canvas && ctx) {
    const box = 20;
    const gridSize = 20;
    let walls = [];
    let maxWalls = 10;
    let snake = [];
    let food = {};
    let score = 0;
    let d;
    let futuristicMode = false;

    function initGame() {
        gameRunning = true;
        snake = [];
        snake[0] = { x: Math.floor(gridSize/2) * box, y: Math.floor(gridSize/2) * box };
        score = 0;
        walls = [];
        document.getElementById('score').innerText = score;
        d = "RIGHT";
        createFood();
        futuristicMode = false;
        document.getElementById('game-title').textContent = 'SYSTEM HACKED: SNAKE PROTOCOL';
        document.getElementById('score-board').style.color = '';
        canvas.style.background = '#050510';
        if(gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(draw, 120);
    }

    document.addEventListener("keydown", direction);

    function direction(event) {
        let key = event.keyCode;
        if (key == 37 && d != "RIGHT") d = "LEFT";
        else if (key == 38 && d != "DOWN") d = "UP";
        else if (key == 39 && d != "LEFT") d = "RIGHT";
        else if (key == 40 && d != "UP") d = "DOWN";
    }

    function createWall() {
        if (!wallsEnabled || walls.length >= maxWalls) return;
        let wall;
        let valid = false;
        while (!valid) {
            wall = {
                x: Math.floor(Math.random() * gridSize) * box,
                y: Math.floor(Math.random() * gridSize) * box
            };
            valid = !collision(wall, snake) && (wall.x !== food.x || wall.y !== food.y) && !collision(wall, walls);
        }
        walls.push(wall);
    }

    function createFood() {
        if (futuristicMode) {
            food = {
                x: Math.floor(Math.random() * gridSize) * box,
                y: Math.floor(Math.random() * gridSize) * box,
                futuristic: true
            };
        } else {
            food = {
                x: Math.floor(Math.random() * gridSize) * box,
                y: Math.floor(Math.random() * gridSize) * box,
                futuristic: false
            };
        }
        if (collision(food, snake) || collision(food, walls)) {
            createFood();
        }
    }

    function draw() {
        ctx.fillStyle = "#050510";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#1a1a1a";
        for(let i=0; i<=gridSize*box; i+=box) {
            ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,gridSize*box); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(gridSize*box,i); ctx.stroke();
        }
        if (score >= 15 && !futuristicMode) {
            futuristicMode = true;
            document.getElementById('game-title').textContent = 'SNAKE 2050: ROBOT PROTOCOL';
            document.getElementById('score-board').style.color = '#bc13fe';
            canvas.style.background = 'linear-gradient(135deg,#222,#444 60%,#bc13fe 100%)';
        }
        for (let i = 0; i < walls.length; i++) {
            ctx.fillStyle = futuristicMode ? '#888' : '#bc13fe';
            ctx.shadowBlur = futuristicMode ? 0 : 10;
            ctx.shadowColor = futuristicMode ? '#888' : '#bc13fe';
            ctx.fillRect(walls[i].x, walls[i].y, box, box);
            ctx.shadowBlur = 0;
        }
        for (let i = 0; i < snake.length; i++) {
            if (futuristicMode) {
                ctx.fillStyle = (i == 0) ? '#b0b0b0' : '#888';
                ctx.strokeStyle = '#222';
            } else {
                ctx.fillStyle = (i == 0) ? '#0aff0a' : '#00f3ff';
                ctx.strokeStyle = '#000';
            }
            ctx.shadowBlur = futuristicMode ? 0 : 15;
            ctx.shadowColor = (i == 0) ? (futuristicMode ? '#b0b0b0' : '#0aff0a') : (futuristicMode ? '#888' : '#00f3ff');
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
            ctx.shadowBlur = 0;
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }
        if (food.futuristic) {
            ctx.fillStyle = '#888';
            ctx.shadowBlur = 0;
            ctx.fillRect(food.x, food.y, box, box);
        } else {
            ctx.fillStyle = '#ff0055';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ff0055';
            ctx.fillRect(food.x, food.y, box, box);
            ctx.shadowBlur = 0;
        }
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;
        if (d == "LEFT") snakeX -= box;
        if (d == "UP") snakeY -= box;
        if (d == "RIGHT") snakeX += box;
        if (d == "DOWN") snakeY += box;
        if (collision({x: snakeX, y: snakeY}, walls)) {
            clearInterval(gameLoop);
            gameRunning = false;
            ctx.fillStyle = "white";
            ctx.font = "40px 'Orbitron'";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
            ctx.font = "20px 'VT323'";
            ctx.fillText("Appuyez sur ESPACE pour relancer", canvas.width/2, canvas.height/2 + 40);
            document.addEventListener('keydown', restartHandler);
            snake.unshift({x: snakeX, y: snakeY});
            return;
        }
        if (snakeX == food.x && snakeY == food.y) {
            score++;
            document.getElementById('score').innerText = score;
            createFood();
            createWall();
        } else {
            snake.pop();
        }
        let newHead = { x: snakeX, y: snakeY };
        if (snakeX < 0 || snakeX >= gridSize*box || snakeY < 0 || snakeY >= gridSize*box || collision(newHead, snake)) {
            clearInterval(gameLoop);
            gameRunning = false;
            ctx.fillStyle = "white";
            ctx.font = "40px 'Orbitron'";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
            ctx.font = "20px 'VT323'";
            ctx.fillText("Appuyez sur ESPACE pour relancer", canvas.width/2, canvas.height/2 + 40);
            document.addEventListener('keydown', restartHandler);
            return;
        }
        snake.unshift(newHead);
    }
    function restartHandler(e) {
        if(e.code === "Space" && !gameRunning) {
            document.removeEventListener('keydown', restartHandler);
            initGame();
        }
    }
    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x == array[i].x && head.y == array[i].y) {
                return true;
            }
        }
        return false;
    }
} else {
    console.error("Canvas element not found for Snake game initialization.");
}
    </script>
</body>
</html>