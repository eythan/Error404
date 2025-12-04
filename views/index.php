<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NIRD - Résistance Numérique</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=VT323&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="views/hiddensnake/styleGlobal.css">
    <style>
    /* Barre de progression verticale */
    #scroll-progress {
        position: fixed;
        right: 20px;
        top: 0;
        width: 8px;
        height: 100vh;
        background: rgba(255,255,255,0.08);
        z-index: 9999;
        border-radius: 4px;
    }
    #scroll-progress-bar {
        width: 100%;
        background: linear-gradient(180deg,#bc13fe,#0aff0a);
        border-radius: 4px;
        height: 0;
        transition: height 0.2s;
    }
    /* Boucle temporelle overlay */
    #time-loop-overlay {
        display: none;
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(44,0,80,0.85);
        z-index: 10000;
        color: #fff;
        font-family: 'Orbitron', monospace;
        font-size: 2.2rem;
        text-align: center;
        padding-top: 20vh;
        animation: glitch 0.2s infinite;
    }
    @keyframes glitch {
        0% { text-shadow: 2px 0 #bc13fe, -2px 0 #0aff0a; }
        50% { text-shadow: -2px 0 #bc13fe, 2px 0 #0aff0a; }
        100% { text-shadow: 2px 0 #bc13fe, -2px 0 #0aff0a; }
    }
    </style>
</head>
<body>
    <?php include __DIR__ . '/hiddensnake/layouts/header.php'; ?>
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
    <div id="scroll-progress">
        <div id="scroll-progress-bar"></div>
    </div>
    <div id="time-loop-overlay">BOUCLE TEMPORELLE !<br>Vous scrollez trop vite dans le continuum numérique...</div>
    <div id="game-overlay" style="display:none;">
        <div id="game-ui">
            <div id="game-title">SYSTEM HACKED: SNAKE PROTOCOL</div>
            <div id="score-board">SCORE: <span id="score">0</span></div>
        </div>
        <canvas id="snakeCanvas" width="400" height="400"></canvas>
        <button id="close-btn" onclick="closeGame()">FERMER LA SIMULATION</button>
    </div>
    <script>
// --- 1. SYSTÈME D'ACTIVATION SECRET (CODE: "nird") ---
const secretCode = ['d', 'r', 'i', 'n']; // Code secret correct
let inputSequence = [];
let gameRunning = false;
let gameLoop; 

window.addEventListener('keydown', (e) => {
    inputSequence.push(e.key.toLowerCase());
    if (inputSequence.length > secretCode.length) {
        inputSequence.shift();
    }
    if (JSON.stringify(inputSequence) === JSON.stringify(secretCode)) {
        activateGame();
        inputSequence = [];
    }
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

// --- 2. MOTEUR DU JEU SNAKE ---
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

    function initGame() {
        gameRunning = true;
        snake = [];
        snake[0] = { x: Math.floor(gridSize/2) * box, y: Math.floor(gridSize/2) * box };
        score = 0;
        walls = [];
        document.getElementById('score').innerText = score;
        d = "RIGHT";
        createFood();
        if(gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(draw, 120); // Vitesse réduite à 60ms
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
        if (walls.length >= maxWalls) return;
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
        food = {
            x: Math.floor(Math.random() * gridSize) * box,
            y: Math.floor(Math.random() * gridSize) * box
        };
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
        for (let i = 0; i < walls.length; i++) {
            ctx.fillStyle = "#bc13fe";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#bc13fe";
            ctx.fillRect(walls[i].x, walls[i].y, box, box);
            ctx.shadowBlur = 0;
        }
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = (i == 0) ? "#0aff0a" : "#00f3ff";
            ctx.shadowBlur = 15;
            ctx.shadowColor = (i == 0) ? "#0aff0a" : "#00f3ff";
            ctx.fillRect(snake[i].x, snake[i].y, box, box);
            ctx.strokeStyle = "#000";
            ctx.shadowBlur = 0;
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }
        ctx.fillStyle = "#ff0055";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#ff0055";
        ctx.fillRect(food.x, food.y, box, box);
        ctx.shadowBlur = 0;
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

// --- SCROLL INFINI + BOUCLE TEMPORELLE + BARRE DE PROGRESSION ---
let lastScroll = Date.now();
let lastScrollTop = 0;
let scrollSpeeds = [];
let timeLoopActive = false;
let fakeContentCount = 0;
let wheelScrollAmount = 0;
let wheelStartTime = null;

function addFakeContent() {
    const container = document.querySelector('.container');
    if (container) {
        for (let i = 0; i < 3; i++) {
            const p = document.createElement('p');
            p.innerHTML = `<span style='color:#bc13fe'>[${++fakeContentCount}]</span> Contenu temporel généré...`;
            container.appendChild(p);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Ajoute du contenu fictif au chargement pour permettre le scroll
    addFakeContent();
    addFakeContent();
    lastScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
});

window.addEventListener('scroll', () => {
    // Barre de progression
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) : 0;
    document.getElementById('scroll-progress-bar').style.height = (percent * 100) + '%';

    // Scroll infini
    if (window.innerHeight + scrollTop >= document.documentElement.scrollHeight - 10) {
        addFakeContent();
    }

    // Boucle temporelle si scroll trop rapide
    const now = Date.now();
    const deltaTime = now - lastScroll;
    const deltaScroll = Math.abs(scrollTop - lastScrollTop);
    lastScroll = now;
    lastScrollTop = scrollTop;
    // pixels par seconde
    const speed = deltaScroll / (deltaTime / 1000);
    scrollSpeeds.push(speed);
    if (scrollSpeeds.length > 10) scrollSpeeds.shift();
    const avgSpeed = scrollSpeeds.reduce((a,b)=>a+b,0)/scrollSpeeds.length;
    if (avgSpeed > 2600 && !timeLoopActive) { // plus de 2600px/sec
        timeLoopActive = true;
        window.scrollTo({top:0,behavior:'smooth'});
        setTimeout(()=>{
            document.getElementById('time-loop-overlay').style.display = 'block';
            setTimeout(()=>{
                document.getElementById('time-loop-overlay').style.display = 'none';
                timeLoopActive = false;
                scrollSpeeds = [];
            }, 1800);
        }, 300); // Affiche l'effet juste après le scrollTo
    }
});

window.addEventListener('wheel', (e) => {
    const now = Date.now();
    if (!wheelStartTime) {
        wheelStartTime = now;
        wheelScrollAmount = 0;
    }
    wheelScrollAmount += Math.abs(e.deltaY);
    const elapsed = now - wheelStartTime;
    if (elapsed > 1000) {
        wheelStartTime = now;
        wheelScrollAmount = Math.abs(e.deltaY);
    }
    const limit = window.innerHeight * 1.5;
    if (wheelScrollAmount > 2600 && !timeLoopActive) {
        timeLoopActive = true;
        window.scrollTo({top:0,behavior:'smooth'});
        setTimeout(()=>{
            document.getElementById('time-loop-overlay').style.display = 'block';
            setTimeout(()=>{
                document.getElementById('time-loop-overlay').style.display = 'none';
                timeLoopActive = false;
                wheelScrollAmount = 0;
                wheelStartTime = null;
            }, 1800);
        }, 300); // Affiche l'effet juste après le scrollTo
    }
});
    </script>
    <?php include __DIR__ . '/hiddensnake/layouts/footer.php'; ?>
</body>
</html>