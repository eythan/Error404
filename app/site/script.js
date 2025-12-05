
// CONFIGURATION DU JEU
const GAME_DURATION = 180; // 3 minutes en secondes
const MAX_HEALTH = 100;
const NIRD_CONCEPTS = ["Progression", "Réalisme", "Motivation", "Contribuer", "Évaluer", "Comprendre"];
const POINTS_HIT = 10;
const POINTS_ENEMY_KILL = 25;
const POINTS_ENEMY_DAMAGE = 30;
const POINTS_MISS = -1;

// ÉTAT DU JEU
let score = 0;
let health = MAX_HEALTH;
let timeLeft = GAME_DURATION;
let gameInterval;
let enemyInterval;
let targetSpawnInterval;
let isGameRunning = false;
let currentGameMode = 1;
const gameArea = document.getElementById('game-area');

// --- ÉLÉMENTS DU DOM ---
const scoreDisplay = document.getElementById('score-display');
const timeDisplay = document.getElementById('time-display');
const motivationBar = document.getElementById('motivation-bar');
const messageOverlay = document.getElementById('message-overlay');
const soundHit = document.getElementById('sound-hit');
const soundMiss = document.getElementById('sound-miss');
const soundPain = document.getElementById('sound-pain');

// QUIZ NIRD - Goliath Numérique
const NIRD_QUIZ = [
    {
        question: "Pour faire face au Goliath du numérique, quelle est la première arme d'un bon Agent NIRD ?",
        options: [
            "Le Démineur 💣 (on sait jamais)",
            "L'esprit critique et l'analyse des sources (la base!)",
            "Un casque en alu pour bloquer les ondes 👽",
            "Des Bitcoins, beaucoup de Bitcoins 💰"
        ],
        correctAnswer: 1,
        explanation: "Réponse B: L'esprit critique est votre bouclier le plus efficace. Le casque en alu, c'est pour les jours de grand soleil.",
        points: 50
    },
    {
        question: "Face à une info douteuse, l'Agent NIRD doit la partager immédiatement pour alerter tout le monde. Vrai ou Faux ?",
        options: [
            "Vrai. La vitesse est vitale, c'est le Net, pas l'escargot 🐌",
            "Faux. Il faut toujours vérifier la source (au moins trois fois!) 🕵️‍♀️",
            "Vrai, mais seulement si elle vient d'un groupe Facebook de mamans de chats 🐱",
            "Faux. Je la mets sur TikTok en mode 'Ceci n'est pas un conseil financier' pour la blague 🤣"
        ],
        correctAnswer: 1,
        explanation: "Réponse B: La mission NIRD, c'est de l'info de qualité ! On vérifie la source avant de propager n'importe quoi. Les mamans de chats, elles, sont souvent fiables. Mais pas sur l'actu.",
        points: 50
    },
    {
        question: "Le 'Fact-Checking', c'est quoi exactement pour l'Agent NIRD ?",
        options: [
            "C'est un check-up médical pour les faits divers. 🩺",
            "C'est l'art de vérifier si les données ou les affirmations sont exactes. ✔️",
            "C'est compter les 'likes' pour savoir si l'info est populaire. 👍",
            "C'est une nouvelle danse de salon très tendance. 💃"
        ],
        correctAnswer: 1,
        explanation: "Réponse B: Le Fact-Checking, c'est le super-pouvoir NIRD pour démasquer les mythes numériques. Pas une danse, désolé les danseurs ! ",
        points: 50
    }
];

let currentQuizIndex = -1;


// FONCTIONS PRINCIPALES DU JEU

/** Met à jour le HUD (Score, Temps, Santé) */
function updateHUD() {
    scoreDisplay.textContent = String(score).padStart(5, '0');
    
    // Temps
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    // Motivation (Santé)
    motivationBar.style.width = `${health}%`;
    if (health > 60) {
        motivationBar.style.backgroundColor = 'var(--neon-green)';
    } else if (health > 30) {
        motivationBar.style.backgroundColor = 'orange';
    } else {
        motivationBar.style.backgroundColor = 'var(--neon-red)';
    }
}

// =====================================
// FONCTIONS QUIZ NIRD
// =====================================

function showNirdQuiz() {
    isGameRunning = false;
    currentQuizIndex = 0;
    const quizOverlay = document.getElementById('nird-quiz-overlay');
    quizOverlay.classList.remove('hidden');
    
    // Jouer un son d'alerte/jingle si possible
    // Si vous avez un jingle quiz (par ex: retro-game-jingleaif-14638.mp3), l'ajouter ici.
    const soundQuiz = document.getElementById('sound-jingle');
    if (soundQuiz) {
        soundQuiz.play();
    }

    displayQuizQuestion();
}

function displayQuizQuestion() {
    const quizData = NIRD_QUIZ[currentQuizIndex];
    const quizContent = document.getElementById('quiz-content');

    quizContent.innerHTML = `
        <h3>MISSION QUIZ NIRD - Question ${currentQuizIndex + 1}/${NIRD_QUIZ.length}</h3>
        <p class="quiz-question">${quizData.question}</p>
        <div class="quiz-options">
            ${quizData.options.map((option, index) => 
                `<button onclick="checkQuizAnswer(${index})" class="quiz-option-btn">${String.fromCharCode(65 + index)}: ${option}</button>`
            ).join('')}
        </div>
        <p id="quiz-feedback" class="quiz-feedback hidden"></p>
        <button id="quiz-next-btn" class="hidden" onclick="nextQuizQuestion()">QUESTION SUIVANTE</button>
    `;
}

function checkQuizAnswer(selectedOptionIndex) {
    const quizData = NIRD_QUIZ[currentQuizIndex];
    const feedbackElement = document.getElementById('quiz-feedback');
    const nextButton = document.getElementById('quiz-next-btn');
    const optionButtons = document.querySelectorAll('.quiz-option-btn');

    // Désactiver tous les boutons pour empêcher de re-cliquer
    optionButtons.forEach(btn => btn.disabled = true);

    if (selectedOptionIndex === quizData.correctAnswer) {
        // Bonne réponse
        score += quizData.points;
        updateHUD();
        feedbackElement.textContent = `EXCELLENT! +${quizData.points} Points NIRD. ${quizData.explanation}`;
        feedbackElement.classList.remove('error');
        feedbackElement.classList.add('success');
        
        // Mettre en évidence la bonne réponse
        optionButtons[selectedOptionIndex].classList.add('correct-answer');

    } else {
        // Mauvaise réponse
        // Pas de perte de points, mais un petit rappel à l'ordre
        feedbackElement.textContent = `ATTENTION AGENT! Réponse fausse. ${quizData.explanation}`;
        feedbackElement.classList.remove('success');
        feedbackElement.classList.add('error');

        // Mettre en évidence la bonne réponse et la réponse de l'utilisateur
        optionButtons[quizData.correctAnswer].classList.add('correct-answer');
        optionButtons[selectedOptionIndex].classList.add('wrong-answer');
    }

    feedbackElement.classList.remove('hidden');
    nextButton.classList.remove('hidden');
}

function nextQuizQuestion() {
    currentQuizIndex++;
    if (currentQuizIndex < NIRD_QUIZ.length) {
        displayQuizQuestion();
    } else {
        // Quiz terminé
        document.getElementById('nird-quiz-overlay').classList.add('hidden');
        // Redémarrer le jeu (par exemple le mode 1)
        startGame(currentGameMode); 
    }
}

/** Génère un élément (cible ou ennemi) à position aléatoire */
function spawnElement(isEnemy = false) {
    if (!isGameRunning) return;

    const element = document.createElement('div');
    
    // Position aléatoire (assure qu'elle n'est pas sous le HUD)
    const randomTop = Math.random() * 80 + 10; // entre 10vh et 90vh
    const randomLeft = Math.random() * 90; // entre 0vw et 90vw

    element.style.left = `${randomLeft}vw`;
    element.style.top = `${randomTop}vh`;

    if (isEnemy) {
        element.classList.add('ennemi');
        element.textContent = '❌';
        
        // Attaque de l'ennemi si non détruit après 2 secondes
        const attackTimeout = setTimeout(() => {
            if (element.parentElement) {
                takeDamage(POINTS_ENEMY_DAMAGE);
                element.remove();
            }
        }, 2000);

        element.onclick = (event) => {
            event.stopPropagation();
            hitTarget(element, POINTS_ENEMY_KILL);
            clearTimeout(attackTimeout);
        };
        
    } else {
        element.classList.add('cible');
        const concept = NIRD_CONCEPTS[Math.floor(Math.random() * NIRD_CONCEPTS.length)];
        element.textContent = concept;

        element.onclick = (event) => {
            event.stopPropagation();
            hitTarget(element, POINTS_HIT);
        };
        
        // Supprime la cible après 3 secondes
        setTimeout(() => {
            if (element.parentElement) {
                element.remove();
            }
        }, 3000);
    }

    gameArea.appendChild(element);
}

/** Gère le tir sur une cible (cible NIRD ou ennemi) */
function hitTarget(element, points) {
    if (!isGameRunning) return;

    score += points;
    
    // Effet visuel et audio
    element.classList.add('hit-effect');
    if (soundHit) {
        soundHit.currentTime = 0;
        soundHit.play().catch(() => {});
    }

    // Retrait de l'élément (l'animation 'hit-effect' gère le reste)
    setTimeout(() => element.remove(), 250);
    
    updateHUD();
}

/** Gère les dégâts subis par le joueur (par un ennemi) */
function takeDamage(damage) {
    if (!isGameRunning) return;

    health -= damage;
    if (health < 0) health = 0;

    // Flash rouge de dégât
    const flash = document.createElement('div');
    flash.classList.add('damage-flash');
    gameArea.appendChild(flash);
    setTimeout(() => flash.remove(), 150);

    if (soundPain) {
        soundPain.currentTime = 0;
        soundPain.play().catch(() => {});
    }
    
    updateHUD();
    
    if (health <= 0) {
        endGame();
    }
}

/** Gère le tir manqué (clic dans le vide) */
function handleMiss(event) {
    // Vérifie si le clic n'a pas touché une cible ou le HUD/Overlay
    if (!isGameRunning || event.target.id !== 'game-area') return;
    
    score += POINTS_MISS;
    if (score < 0) score = 0;

    if (soundMiss) {
        soundMiss.currentTime = 0;
        soundMiss.play().catch(() => {});
    }

    updateHUD();
}

/** Démarrage du jeu */
function startGame(mode = 1) {
    if (isGameRunning) return;
    
    currentGameMode = mode;
    
    // Mode 3: Laser Game Top-Down
    if (mode === 3) {
        startMode3Game();
        return;
    }
    
    // Mode 4: Progression Tower
    if (mode === 4) {
        startMode4Game();
        return;
    }
    
    // Modes 1 et 2
    isGameRunning = true;
    score = 0;
    health = MAX_HEALTH;
    timeLeft = GAME_DURATION;
    messageOverlay.style.display = 'none';
    document.getElementById('hud-container').style.display = 'flex';
    gameArea.style.display = 'block';

    updateHUD();
    document.addEventListener('click', handleMiss);

    // Boucle principale (temps)
    gameInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            timeLeft = 0;
            endGame();
        }
        updateHUD();
    }, 1000);

    // Mode 1: Classique
    if (mode === 1) {
        targetSpawnInterval = setInterval(() => spawnElement(false), 800);
        enemyInterval = setInterval(() => spawnElement(true), 1500);
    }
    // Mode 2: Survie (plus difficile, plus d'ennemis)
    else if (mode === 2) {
        targetSpawnInterval = setInterval(() => spawnElement(false), 600);
        enemyInterval = setInterval(() => spawnElement(true), 1000);
    }
}

/** Fin du jeu */
function endGame() {
    isGameRunning = false;
    clearInterval(gameInterval);
    clearInterval(enemyInterval);
    clearInterval(targetSpawnInterval);
    document.removeEventListener('click', handleMiss);

    // Retirer tous les éléments de jeu
    gameArea.querySelectorAll('.cible, .ennemi').forEach(el => el.remove());

    showScoreTable();
}

// GESTION DES SCORES (LocalStorage)

function getHighScores() {
    // Structure: [{ name: "Nom", score: 12345, mode: 1 }]
    const scores = JSON.parse(localStorage.getItem('nirdLaserGameScores')) || [];
    return scores.sort((a, b) => b.score - a.score);
}

function saveHighScore(newScore) {
    const playerName = prompt("Félicitations, Agent NIRD ! Entrez votre nom pour le classement :");
    if (playerName && newScore > 0) {
        const highScores = getHighScores();
        highScores.push({ 
            name: playerName.substring(0, 15), 
            score: newScore,
            mode: currentGameMode
        });
        const topScores = highScores.sort((a, b) => b.score - a.score).slice(0, 10);
        localStorage.setItem('nirdLaserGameScores', JSON.stringify(topScores));
    }
}

function showScoreTable() {
    saveHighScore(score);

    const scores = getHighScores();
    const tableBody = document.getElementById('high-scores-body');
    const scoreTableOverlay = document.getElementById('score-table-overlay');
    const finalScoreDisplay = document.getElementById('final-score');

    finalScoreDisplay.textContent = `Score Final: ${String(score).padStart(5, '0')}`;
    tableBody.innerHTML = '';

    scores.forEach((s, index) => {
        const row = tableBody.insertRow();
        if (index === 0) row.classList.add('top-score'); 
        
        row.insertCell().textContent = index + 1;
        row.insertCell().textContent = s.name;
        row.insertCell().textContent = String(s.score).padStart(5, '0');
        row.insertCell().textContent = 'Mode ' + (s.mode || 1);
    });

    scoreTableOverlay.classList.remove('hidden');
}

// MODE 3: LASER GAME TOP-DOWN

const MODE3_CONFIG = {
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    PLAYER_SIZE: 30,
    PLAYER_SPEED: 4,
    LASER_SPEED: 8,
    LASER_SIZE: 15,
    MICROBE_SIZE: 25,
    LOOT_SIZE: 20,
    MICROBE_SPEED: 1.5,
    MICROBE_SPAWN_RATE: 120, // frames
    LOOT_SPAWN_RATE: 300, // frames
    MICROBE_POINTS: 50,
};

const NIRD_TIPS = [
    {
        title: "Progression",
        text: "Le NIRD valorise la progression régulière plutôt que la perfection immédiate. Chaque petit pas compte !"
    },
    {
        title: "Réalisme",
        text: "Établir des objectifs réalistes et atteignables est essentiel pour maintenir la motivation et éviter l'épuisement."
    },
    {
        title: "Motivation",
        text: "La motivation intrinsèque (plaisir d'apprendre) est plus durable que la motivation extrinsèque (notes, récompenses)."
    },
    {
        title: "Contribuer",
        text: "Contribuer activement à un projet renforce l'apprentissage et le sentiment d'appartenance à une communauté."
    },
    {
        title: "Évaluer",
        text: "L'auto-évaluation régulière permet de mieux comprendre ses forces et ses axes d'amélioration."
    },
    {
        title: "Comprendre",
        text: "Comprendre en profondeur vaut mieux que mémoriser superficiellement. Prenez le temps d'explorer les concepts !"
    },
    {
        title: "Efficacité",
        text: "Travailler intelligemment plutôt que longtemps : des sessions courtes et concentrées sont plus efficaces."
    },
    {
        title: "Itération",
        text: "L'apprentissage est itératif : il est normal de revenir sur des concepts pour mieux les maîtriser."
    }
];

let mode3State = {
    canvas: null,
    ctx: null,
    player: { x: 400, y: 300, angle: 0 },
    keys: {},
    lasers: [],
    microbes: [],
    loots: [],
    score: 0,
    kills: 0,
    frameCount: 0,
    animationId: null
};

function startMode3Game() {
    messageOverlay.style.display = 'none';
    document.getElementById('hud-container').style.display = 'none';
    gameArea.style.display = 'none';
    
    const mode3Area = document.getElementById('mode3-game-area');
    mode3Area.classList.remove('hidden');
    
    mode3State.canvas = document.getElementById('mode3-canvas');
    mode3State.ctx = mode3State.canvas.getContext('2d');
    
    // Configurer le canvas
    mode3State.canvas.width = MODE3_CONFIG.CANVAS_WIDTH;
    mode3State.canvas.height = MODE3_CONFIG.CANVAS_HEIGHT;
    
    // Réinitialiser l'état
    mode3State.player = { 
        x: MODE3_CONFIG.CANVAS_WIDTH / 2, 
        y: MODE3_CONFIG.CANVAS_HEIGHT / 2, 
        angle: 0 
    };
    mode3State.keys = {};
    mode3State.lasers = [];
    mode3State.microbes = [];
    mode3State.loots = [];
    mode3State.score = 0;
    mode3State.kills = 0;
    mode3State.frameCount = 0;
    
    // Event listeners
    document.addEventListener('keydown', mode3KeyDown);
    document.addEventListener('keyup', mode3KeyUp);
    mode3State.canvas.addEventListener('mousemove', mode3MouseMove);
    mode3State.canvas.addEventListener('click', mode3Shoot);
    
    isGameRunning = true;
    mode3GameLoop();
    updateMode3HUD();
}

function mode3KeyDown(e) {
    if (['z', 'q', 's', 'd', 'Z', 'Q', 'S', 'D', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        mode3State.keys[e.key.toLowerCase()] = true;
    }
}

function mode3KeyUp(e) {
    mode3State.keys[e.key.toLowerCase()] = false;
}

function mode3MouseMove(e) {
    const rect = mode3State.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const dx = mouseX - mode3State.player.x;
    const dy = mouseY - mode3State.player.y;
    mode3State.player.angle = Math.atan2(dy, dx);
}

function mode3Shoot() {
    if (!isGameRunning) return;
    
    const laser = {
        x: mode3State.player.x,
        y: mode3State.player.y,
        angle: mode3State.player.angle,
        vx: Math.cos(mode3State.player.angle) * MODE3_CONFIG.LASER_SPEED,
        vy: Math.sin(mode3State.player.angle) * MODE3_CONFIG.LASER_SPEED
    };
    
    mode3State.lasers.push(laser);
    
    if (soundHit) {
        soundHit.currentTime = 0;
        soundHit.play().catch(() => {});
    }
}

function mode3GameLoop() {
    if (!isGameRunning) return;
    
    mode3State.frameCount++;
    
    // Déplacer le joueur
    let dx = 0, dy = 0;
    if (mode3State.keys['z'] || mode3State.keys['arrowup']) dy -= MODE3_CONFIG.PLAYER_SPEED;
    if (mode3State.keys['s'] || mode3State.keys['arrowdown']) dy += MODE3_CONFIG.PLAYER_SPEED;
    if (mode3State.keys['q'] || mode3State.keys['arrowleft']) dx -= MODE3_CONFIG.PLAYER_SPEED;
    if (mode3State.keys['d'] || mode3State.keys['arrowright']) dx += MODE3_CONFIG.PLAYER_SPEED;
    
    mode3State.player.x = Math.max(MODE3_CONFIG.PLAYER_SIZE, Math.min(MODE3_CONFIG.CANVAS_WIDTH - MODE3_CONFIG.PLAYER_SIZE, mode3State.player.x + dx));
    mode3State.player.y = Math.max(MODE3_CONFIG.PLAYER_SIZE, Math.min(MODE3_CONFIG.CANVAS_HEIGHT - MODE3_CONFIG.PLAYER_SIZE, mode3State.player.y + dy));
    
    // Déplacer les lasers
    mode3State.lasers = mode3State.lasers.filter(laser => {
        laser.x += laser.vx;
        laser.y += laser.vy;
        return laser.x > 0 && laser.x < MODE3_CONFIG.CANVAS_WIDTH && 
               laser.y > 0 && laser.y < MODE3_CONFIG.CANVAS_HEIGHT;
    });
    
    // Spawn microbes
    if (mode3State.frameCount % MODE3_CONFIG.MICROBE_SPAWN_RATE === 0) {
        spawnMicrobe();
    }
    
    // Spawn loots
    if (mode3State.frameCount % MODE3_CONFIG.LOOT_SPAWN_RATE === 0) {
        spawnLoot();
    }
    
    // Déplacer microbes vers le joueur
    mode3State.microbes.forEach(microbe => {
        const dx = mode3State.player.x - microbe.x;
        const dy = mode3State.player.y - microbe.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 0) {
            microbe.x += (dx / dist) * MODE3_CONFIG.MICROBE_SPEED;
            microbe.y += (dy / dist) * MODE3_CONFIG.MICROBE_SPEED;
        }
    });
    
    // Collision lasers-microbes
    mode3State.lasers.forEach((laser, li) => {
        mode3State.microbes.forEach((microbe, mi) => {
            const dx = laser.x - microbe.x;
            const dy = laser.y - microbe.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < MODE3_CONFIG.MICROBE_SIZE) {
                mode3State.lasers.splice(li, 1);
                mode3State.microbes.splice(mi, 1);
                mode3State.score += MODE3_CONFIG.MICROBE_POINTS;
                mode3State.kills++;
                updateMode3HUD();
            }
        });
    });
    
    // Collision joueur-microbes
    mode3State.microbes = mode3State.microbes.filter(microbe => {
        const dx = mode3State.player.x - microbe.x;
        const dy = mode3State.player.y - microbe.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < MODE3_CONFIG.PLAYER_SIZE + MODE3_CONFIG.MICROBE_SIZE) {
            mode3State.score = Math.max(0, mode3State.score - 100);
            updateMode3HUD();
            
            if (soundPain) {
                soundPain.currentTime = 0;
                soundPain.play().catch(() => {});
            }
            return false;
        }
        return true;
    });
    
    // Collision joueur-loots
    mode3State.loots = mode3State.loots.filter(loot => {
        const dx = mode3State.player.x - loot.x;
        const dy = mode3State.player.y - loot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < MODE3_CONFIG.PLAYER_SIZE + MODE3_CONFIG.LOOT_SIZE) {
            showNirdTip();
            mode3State.score += 100;
            updateMode3HUD();
            return false;
        }
        return true;
    });
    
    // Dessiner
    mode3Draw();
    
    mode3State.animationId = requestAnimationFrame(mode3GameLoop);
}

function spawnMicrobe() {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch(side) {
        case 0: x = Math.random() * MODE3_CONFIG.CANVAS_WIDTH; y = -MODE3_CONFIG.MICROBE_SIZE; break;
        case 1: x = MODE3_CONFIG.CANVAS_WIDTH + MODE3_CONFIG.MICROBE_SIZE; y = Math.random() * MODE3_CONFIG.CANVAS_HEIGHT; break;
        case 2: x = Math.random() * MODE3_CONFIG.CANVAS_WIDTH; y = MODE3_CONFIG.CANVAS_HEIGHT + MODE3_CONFIG.MICROBE_SIZE; break;
        case 3: x = -MODE3_CONFIG.MICROBE_SIZE; y = Math.random() * MODE3_CONFIG.CANVAS_HEIGHT; break;
    }
    
    mode3State.microbes.push({ 
        x, 
        y,
        type: Math.floor(Math.random() * 3) // 3 types de microbes
    });
}

function spawnLoot() {
    const loot = {
        x: Math.random() * (MODE3_CONFIG.CANVAS_WIDTH - 100) + 50,
        y: Math.random() * (MODE3_CONFIG.CANVAS_HEIGHT - 100) + 50,
        pulse: 0
    };
    mode3State.loots.push(loot);
}

function mode3Draw() {
    const ctx = mode3State.ctx;
    
    // Fond
    ctx.fillStyle = '#030312';
    ctx.fillRect(0, 0, MODE3_CONFIG.CANVAS_WIDTH, MODE3_CONFIG.CANVAS_HEIGHT);
    
    // Grille
    ctx.strokeStyle = 'rgba(0, 255, 200, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < MODE3_CONFIG.CANVAS_WIDTH; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, MODE3_CONFIG.CANVAS_HEIGHT);
        ctx.stroke();
    }
    for (let i = 0; i < MODE3_CONFIG.CANVAS_HEIGHT; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(MODE3_CONFIG.CANVAS_WIDTH, i);
        ctx.stroke();
    }
    
    // Loots
    mode3State.loots.forEach(loot => {
        loot.pulse += 0.1;
        const size = MODE3_CONFIG.LOOT_SIZE + Math.sin(loot.pulse) * 5;
        
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(loot.x, loot.y, size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('📚', loot.x, loot.y + 6);
    });
    
    // Microbes
    mode3State.microbes.forEach(microbe => {
        ctx.fillStyle = microbe.type === 0 ? '#ff3333' : microbe.type === 1 ? '#ff6633' : '#ff3366';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(microbe.x, microbe.y, MODE3_CONFIG.MICROBE_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Yeux
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(microbe.x - 5, microbe.y - 3, 3, 0, Math.PI * 2);
        ctx.arc(microbe.x + 5, microbe.y - 3, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(microbe.x - 5, microbe.y - 3, 1.5, 0, Math.PI * 2);
        ctx.arc(microbe.x + 5, microbe.y - 3, 1.5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Lasers
    ctx.strokeStyle = '#00ffc8';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00ffc8';
    ctx.shadowBlur = 10;
    mode3State.lasers.forEach(laser => {
        ctx.beginPath();
        ctx.moveTo(laser.x, laser.y);
        ctx.lineTo(laser.x - laser.vx * 2, laser.y - laser.vy * 2);
        ctx.stroke();
    });
    ctx.shadowBlur = 0;
    
    // Joueur
    ctx.save();
    ctx.translate(mode3State.player.x, mode3State.player.y);
    ctx.rotate(mode3State.player.angle);
    
    // Corps
    ctx.fillStyle = '#00ffc8';
    ctx.shadowColor = '#00ffc8';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(0, 0, MODE3_CONFIG.PLAYER_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Canon
    ctx.fillStyle = '#00ffc8';
    ctx.fillRect(MODE3_CONFIG.PLAYER_SIZE / 4, -3, MODE3_CONFIG.PLAYER_SIZE / 2, 6);
    
    ctx.shadowBlur = 0;
    ctx.restore();
}

function updateMode3HUD() {
    document.getElementById('mode3-score').textContent = String(mode3State.score).padStart(5, '0');
    document.getElementById('mode3-kills').textContent = String(mode3State.kills).padStart(2, '0');
}

function showNirdTip() {
    const tip = NIRD_TIPS[Math.floor(Math.random() * NIRD_TIPS.length)];
    const popup = document.getElementById('nird-popup');
    
    document.getElementById('popup-title').textContent = tip.title;
    document.getElementById('popup-text').textContent = tip.text;
    
    popup.classList.remove('hidden');
}

function closeNirdPopup() {
    document.getElementById('nird-popup').classList.add('hidden');
}

function endMode3Game() {
    isGameRunning = false;
    cancelAnimationFrame(mode3State.animationId);
    
    document.removeEventListener('keydown', mode3KeyDown);
    document.removeEventListener('keyup', mode3KeyUp);
    
    score = mode3State.score;
    showScoreTable();
}

// MODE 4: PROGRESSION TOWER

const MODE4_CONFIG = {
    CANVAS_WIDTH: 900,
    CANVAS_HEIGHT: 700,
    PLAYER_SIZE: 35,
    PLAYER_SPEED: 5,
    BULLET_SPEED: 10,
    BULLET_SIZE: 8,
    ENEMY_SIZE: 30,
    PLATFORM_HEIGHT: 20,
    JUMP_FORCE: 12,
    GRAVITY: 0.5,
};

const MODE4_LEVELS = [
    {
        level: 1,
        name: "Comprendre les bases",
        objective: 10,
        enemySpeed: 1,
        enemySpawnRate: 180,
        message: "Bien joué ! Vous maîtrisez les concepts de base du NIRD. Continuez votre progression !"
    },
    {
        level: 2,
        name: "Évaluer ses progrès",
        objective: 15,
        enemySpeed: 1.3,
        enemySpawnRate: 150,
        message: "Excellent ! L'auto-évaluation est la clé de l'amélioration continue."
    },
    {
        level: 3,
        name: "Contribuer activement",
        objective: 20,
        enemySpeed: 1.6,
        enemySpawnRate: 120,
        message: "Fantastique ! Votre contribution fait la différence dans la communauté."
    },
    {
        level: 4,
        name: "Maintenir la motivation",
        objective: 25,
        enemySpeed: 2,
        enemySpawnRate: 100,
        message: "Incroyable ! Votre motivation intrinsèque vous pousse vers l'excellence."
    },
    {
        level: 5,
        name: "Maître du NIRD",
        objective: 30,
        enemySpeed: 2.5,
        enemySpawnRate: 80,
        message: "🏆 FÉLICITATIONS ! Vous êtes un Maître du NIRD ! Votre progression est exemplaire !"
    }
];

let mode4State = {
    canvas: null,
    ctx: null,
    player: { 
        x: 100, 
        y: 500, 
        vx: 0, 
        vy: 0, 
        onGround: false,
        facingRight: true
    },
    keys: {},
    bullets: [],
    enemies: [],
    platforms: [],
    score: 0,
    level: 1,
    lives: 3,
    killsThisLevel: 0,
    frameCount: 0,
    animationId: null,
    isPaused: false
};

function startMode4Game() {
    messageOverlay.style.display = 'none';
    document.getElementById('hud-container').style.display = 'none';
    gameArea.style.display = 'none';
    
    const mode4Area = document.getElementById('mode4-game-area');
    mode4Area.classList.remove('hidden');
    
    mode4State.canvas = document.getElementById('mode4-canvas');
    mode4State.ctx = mode4State.canvas.getContext('2d');
    
    // Configurer le canvas
    mode4State.canvas.width = MODE4_CONFIG.CANVAS_WIDTH;
    mode4State.canvas.height = MODE4_CONFIG.CANVAS_HEIGHT;
    
    // Réinitialiser l'état
    initMode4Level();
    
    // Event listeners
    document.addEventListener('keydown', mode4KeyDown);
    document.addEventListener('keyup', mode4KeyUp);
    
    isGameRunning = true;
    mode4GameLoop();
}

function initMode4Level() {
    mode4State.player = { 
        x: 100, 
        y: 500, 
        vx: 0, 
        vy: 0, 
        onGround: false,
        facingRight: true
    };
    mode4State.keys = {};
    mode4State.bullets = [];
    mode4State.enemies = [];
    mode4State.frameCount = 0;
    mode4State.killsThisLevel = 0;
    mode4State.isPaused = false;
    
    // Créer les plateformes
    mode4State.platforms = [
        { x: 0, y: MODE4_CONFIG.CANVAS_HEIGHT - 50, width: MODE4_CONFIG.CANVAS_WIDTH, height: 50 },
        { x: 150, y: 550, width: 200, height: MODE4_CONFIG.PLATFORM_HEIGHT },
        { x: 450, y: 450, width: 200, height: MODE4_CONFIG.PLATFORM_HEIGHT },
        { x: 100, y: 350, width: 150, height: MODE4_CONFIG.PLATFORM_HEIGHT },
        { x: 550, y: 300, width: 180, height: MODE4_CONFIG.PLATFORM_HEIGHT },
        { x: 300, y: 200, width: 250, height: MODE4_CONFIG.PLATFORM_HEIGHT }
    ];
    
    updateMode4HUD();
}

function mode4KeyDown(e) {
    if (['z', 'q', 's', 'd', 'Z', 'Q', 'S', 'D', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
        mode4State.keys[e.key.toLowerCase()] = true;
        
        // Saut
        if ((e.key === 'z' || e.key === 'Z' || e.key === 'ArrowUp') && mode4State.player.onGround) {
            mode4State.player.vy = -MODE4_CONFIG.JUMP_FORCE;
            mode4State.player.onGround = false;
        }
        
        // Tir
        if (e.key === ' ') {
            mode4Shoot();
        }
    }
}

function mode4KeyUp(e) {
    mode4State.keys[e.key.toLowerCase()] = false;
}

function mode4Shoot() {
    if (!isGameRunning || mode4State.isPaused) return;
    
    const bullet = {
        x: mode4State.player.x + (mode4State.player.facingRight ? MODE4_CONFIG.PLAYER_SIZE : 0),
        y: mode4State.player.y + MODE4_CONFIG.PLAYER_SIZE / 2,
        vx: mode4State.player.facingRight ? MODE4_CONFIG.BULLET_SPEED : -MODE4_CONFIG.BULLET_SPEED
    };
    
    mode4State.bullets.push(bullet);
    
    if (soundHit) {
        soundHit.currentTime = 0;
        soundHit.play().catch(() => {});
    }
}

function mode4GameLoop() {
    if (!isGameRunning) return;
    
    if (!mode4State.isPaused) {
        mode4State.frameCount++;
        
        // Déplacer le joueur
        let dx = 0;
        if (mode4State.keys['q'] || mode4State.keys['arrowleft']) {
            dx -= MODE4_CONFIG.PLAYER_SPEED;
            mode4State.player.facingRight = false;
        }
        if (mode4State.keys['d'] || mode4State.keys['arrowright']) {
            dx += MODE4_CONFIG.PLAYER_SPEED;
            mode4State.player.facingRight = true;
        }
        
        mode4State.player.vx = dx;
        mode4State.player.x += mode4State.player.vx;
        
        // Gravité
        mode4State.player.vy += MODE4_CONFIG.GRAVITY;
        mode4State.player.y += mode4State.player.vy;
        
        // Limites du canvas
        if (mode4State.player.x < 0) mode4State.player.x = 0;
        if (mode4State.player.x > MODE4_CONFIG.CANVAS_WIDTH - MODE4_CONFIG.PLAYER_SIZE) {
            mode4State.player.x = MODE4_CONFIG.CANVAS_WIDTH - MODE4_CONFIG.PLAYER_SIZE;
        }
        
        // Collision avec les plateformes
        mode4State.player.onGround = false;
        mode4State.platforms.forEach(platform => {
            if (mode4State.player.x + MODE4_CONFIG.PLAYER_SIZE > platform.x &&
                mode4State.player.x < platform.x + platform.width &&
                mode4State.player.y + MODE4_CONFIG.PLAYER_SIZE > platform.y &&
                mode4State.player.y + MODE4_CONFIG.PLAYER_SIZE < platform.y + platform.height &&
                mode4State.player.vy >= 0) {
                mode4State.player.y = platform.y - MODE4_CONFIG.PLAYER_SIZE;
                mode4State.player.vy = 0;
                mode4State.player.onGround = true;
            }
        });
        
        // Spawn ennemis
        const currentLevel = MODE4_LEVELS[mode4State.level - 1];
        if (mode4State.frameCount % currentLevel.enemySpawnRate === 0) {
            spawnMode4Enemy();
        }
        
        // Déplacer les ennemis
        mode4State.enemies.forEach(enemy => {
            enemy.x += enemy.vx;
            
            // Rebond sur les bords
            if (enemy.x < 0 || enemy.x > MODE4_CONFIG.CANVAS_WIDTH - MODE4_CONFIG.ENEMY_SIZE) {
                enemy.vx *= -1;
            }
            
            // Gravité pour les ennemis
            enemy.vy += MODE4_CONFIG.GRAVITY;
            enemy.y += enemy.vy;
            
            // Collision ennemis-plateformes
            mode4State.platforms.forEach(platform => {
                if (enemy.x + MODE4_CONFIG.ENEMY_SIZE > platform.x &&
                    enemy.x < platform.x + platform.width &&
                    enemy.y + MODE4_CONFIG.ENEMY_SIZE > platform.y &&
                    enemy.y + MODE4_CONFIG.ENEMY_SIZE < platform.y + platform.height &&
                    enemy.vy >= 0) {
                    enemy.y = platform.y - MODE4_CONFIG.ENEMY_SIZE;
                    enemy.vy = 0;
                }
            });
        });
        
        // Déplacer les balles
        mode4State.bullets = mode4State.bullets.filter(bullet => {
            bullet.x += bullet.vx;
            return bullet.x > 0 && bullet.x < MODE4_CONFIG.CANVAS_WIDTH;
        });
        
        // Collision balles-ennemis
        mode4State.bullets.forEach((bullet, bi) => {
            mode4State.enemies.forEach((enemy, ei) => {
                const dx = bullet.x - (enemy.x + MODE4_CONFIG.ENEMY_SIZE / 2);
                const dy = bullet.y - (enemy.y + MODE4_CONFIG.ENEMY_SIZE / 2);
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < MODE4_CONFIG.ENEMY_SIZE / 2) {
                    mode4State.bullets.splice(bi, 1);
                    mode4State.enemies.splice(ei, 1);
                    mode4State.score += 100;
                    mode4State.killsThisLevel++;
                    updateMode4HUD();
                    
                    // Vérifier si le niveau est terminé
                    if (mode4State.killsThisLevel >= currentLevel.objective) {
                        completeLevel();
                    }
                }
            });
        });
        
        // Collision joueur-ennemis
        mode4State.enemies = mode4State.enemies.filter(enemy => {
            const dx = mode4State.player.x - enemy.x;
            const dy = mode4State.player.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < MODE4_CONFIG.PLAYER_SIZE) {
                mode4State.lives--;
                updateMode4HUD();
                
                if (soundPain) {
                    soundPain.currentTime = 0;
                    soundPain.play().catch(() => {});
                }
                
                if (mode4State.lives <= 0) {
                    endMode4Game();
                }
                return false;
            }
            return true;
        });
    }
    
    // Dessiner
    mode4Draw();
    
    mode4State.animationId = requestAnimationFrame(mode4GameLoop);
}

function spawnMode4Enemy() {
    const currentLevel = MODE4_LEVELS[mode4State.level - 1];
    const enemy = {
        x: Math.random() > 0.5 ? 0 : MODE4_CONFIG.CANVAS_WIDTH - MODE4_CONFIG.ENEMY_SIZE,
        y: 100,
        vx: (Math.random() > 0.5 ? 1 : -1) * currentLevel.enemySpeed,
        vy: 0,
        type: Math.floor(Math.random() * 3)
    };
    mode4State.enemies.push(enemy);
}

function mode4Draw() {
    const ctx = mode4State.ctx;
    
    // Fond avec dégradé
    const gradient = ctx.createLinearGradient(0, 0, 0, MODE4_CONFIG.CANVAS_HEIGHT);
    gradient.addColorStop(0, '#030312');
    gradient.addColorStop(1, '#0a0a20');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, MODE4_CONFIG.CANVAS_WIDTH, MODE4_CONFIG.CANVAS_HEIGHT);
    
    // Grille
    ctx.strokeStyle = 'rgba(0, 255, 200, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < MODE4_CONFIG.CANVAS_WIDTH; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, MODE4_CONFIG.CANVAS_HEIGHT);
        ctx.stroke();
    }
    
    // Plateformes
    mode4State.platforms.forEach(platform => {
        ctx.fillStyle = '#00ffc8';
        ctx.shadowColor = '#00ffc8';
        ctx.shadowBlur = 10;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        ctx.shadowBlur = 0;
        
        // Bordure
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    });
    
    // Ennemis
    mode4State.enemies.forEach(enemy => {
        const colors = ['#ff3333', '#ff6633', '#ff3366'];
        ctx.fillStyle = colors[enemy.type];
        ctx.shadowColor = colors[enemy.type];
        ctx.shadowBlur = 15;
        
        // Corps de l'ennemi (carré avec rotation)
        ctx.save();
        ctx.translate(enemy.x + MODE4_CONFIG.ENEMY_SIZE / 2, enemy.y + MODE4_CONFIG.ENEMY_SIZE / 2);
        ctx.rotate(mode4State.frameCount * 0.05);
        ctx.fillRect(-MODE4_CONFIG.ENEMY_SIZE / 2, -MODE4_CONFIG.ENEMY_SIZE / 2, MODE4_CONFIG.ENEMY_SIZE, MODE4_CONFIG.ENEMY_SIZE);
        ctx.restore();
        
        ctx.shadowBlur = 0;
    });
    
    // Balles
    ctx.fillStyle = '#ffff00';
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 10;
    mode4State.bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, MODE4_CONFIG.BULLET_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.shadowBlur = 0;
    
    // Joueur
    ctx.fillStyle = '#00ffc8';
    ctx.shadowColor = '#00ffc8';
    ctx.shadowBlur = 20;
    ctx.fillRect(mode4State.player.x, mode4State.player.y, MODE4_CONFIG.PLAYER_SIZE, MODE4_CONFIG.PLAYER_SIZE);
    ctx.shadowBlur = 0;
    
    // Yeux du joueur
    ctx.fillStyle = '#fff';
    const eyeOffset = mode4State.player.facingRight ? 15 : 5;
    ctx.fillRect(mode4State.player.x + eyeOffset, mode4State.player.y + 10, 5, 5);
    ctx.fillRect(mode4State.player.x + eyeOffset, mode4State.player.y + 20, 5, 5);
}

function updateMode4HUD() {
    const currentLevel = MODE4_LEVELS[mode4State.level - 1];
    document.getElementById('mode4-level').textContent = String(mode4State.level).padStart(2, '0');
    document.getElementById('mode4-score').textContent = String(mode4State.score).padStart(5, '0');
    document.getElementById('mode4-lives').textContent = '❤️'.repeat(mode4State.lives);
    document.getElementById('mode4-objective').textContent = `${mode4State.killsThisLevel}/${currentLevel.objective}`;
}

function completeLevel() {
    mode4State.isPaused = true;
    const currentLevel = MODE4_LEVELS[mode4State.level - 1];
    
    const overlay = document.getElementById('mode4-level-complete');
    const message = document.getElementById('level-complete-message');
    
    message.textContent = currentLevel.message;
    overlay.classList.remove('hidden');
}

function nextLevel() {
    document.getElementById('mode4-level-complete').classList.add('hidden');
    
    if (mode4State.level >= MODE4_LEVELS.length) {
        // Jeu terminé !
        endMode4Game();
    } else {
        mode4State.level++;
        initMode4Level();
    }
}

function endMode4Game() {
    isGameRunning = false;
    cancelAnimationFrame(mode4State.animationId);
    
    document.removeEventListener('keydown', mode4KeyDown);
    document.removeEventListener('keyup', mode4KeyUp);
    
    score = mode4State.score;
    showScoreTable();
}

function levelComplete() {
    isGameRunning = false;
    cancelAnimationFrame(mode4State.animationId);

    // Ajout du Quiz après le NIVEAU 1
    if (mode4State.level === 1 && currentQuizIndex === -1) {
        // Si c'est le niveau 1 et que le quiz n'a jamais été fait
        showNirdQuiz();
        return; // Stoppe la progression du niveau pour faire le quiz
    }


    document.getElementById('mode4-level-complete').classList.remove('hidden');
    document.getElementById('level-complete-title').textContent = `NIVEAU ${mode4State.level} ACCOMPLI !`;
    document.getElementById('level-complete-score').textContent = `Score actuel: ${mode4State.score}`;
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    messageOverlay.style.display = 'flex';
    
    // Ajouter le bouton de fin de partie pour le mode 3
    const mode3Area = document.getElementById('mode3-game-area');
    const endButton3 = document.createElement('button');
    endButton3.textContent = 'TERMINER LA MISSION';
    endButton3.className = 'end-mode3-btn';
    endButton3.onclick = endMode3Game;
    mode3Area.appendChild(endButton3);
    
    // Ajouter le bouton de fin de partie pour le mode 4
    const mode4Area = document.getElementById('mode4-game-area');
    const endButton4 = document.createElement('button');
    endButton4.textContent = 'TERMINER LA MISSION';
    endButton4.className = 'end-mode3-btn';
    endButton4.onclick = endMode4Game;
    mode4Area.appendChild(endButton4);
});