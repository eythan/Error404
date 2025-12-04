// ====================================
// CONFIGURATION DU JEU
// ====================================
const GAME_DURATION = 180; // 3 minutes en secondes
const MAX_HEALTH = 100;
const NIRD_CONCEPTS = ["Progression", "Réalisme", "Motivation", "Contribuer", "Évaluer", "Comprendre"];
const POINTS_HIT = 10;
const POINTS_ENEMY_KILL = 25;
const POINTS_ENEMY_DAMAGE = 30;
const POINTS_MISS = -1;

// ====================================
// ÉTAT DU JEU
// ====================================
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


// ====================================
// FONCTIONS PRINCIPALES DU JEU
// ====================================

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

// ====================================
// GESTION DES SCORES (LocalStorage)
// ====================================

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

// ====================================
// MODE 3: LASER GAME TOP-DOWN
// ====================================

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
        title: "🎯 Progression",
        text: "Le NIRD valorise la progression régulière plutôt que la perfection immédiate. Chaque petit pas compte !"
    },
    {
        title: "🔍 Réalisme",
        text: "Établir des objectifs réalistes et atteignables est essentiel pour maintenir la motivation et éviter l'épuisement."
    },
    {
        title: "💪 Motivation",
        text: "La motivation intrinsèque (plaisir d'apprendre) est plus durable que la motivation extrinsèque (notes, récompenses)."
    },
    {
        title: "🤝 Contribuer",
        text: "Contribuer activement à un projet renforce l'apprentissage et le sentiment d'appartenance à une communauté."
    },
    {
        title: "📊 Évaluer",
        text: "L'auto-évaluation régulière permet de mieux comprendre ses forces et ses axes d'amélioration."
    },
    {
        title: "🧠 Comprendre",
        text: "Comprendre en profondeur vaut mieux que mémoriser superficiellement. Prenez le temps d'explorer les concepts !"
    },
    {
        title: "⚡ Efficacité",
        text: "Travailler intelligemment plutôt que longtemps : des sessions courtes et concentrées sont plus efficaces."
    },
    {
        title: "🔄 Itération",
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

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    messageOverlay.style.display = 'flex';
    
    // Ajouter le bouton de fin de partie pour le mode 3
    const mode3Area = document.getElementById('mode3-game-area');
    const endButton = document.createElement('button');
    endButton.textContent = 'TERMINER LA MISSION';
    endButton.className = 'end-mode3-btn';
    endButton.onclick = endMode3Game;
    mode3Area.appendChild(endButton);
});