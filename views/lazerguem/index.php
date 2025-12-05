<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>La Zerguèm de la Nuit - Mission NIRD</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="public/styles/lazerguem.css">
</head>

<body>
    <div id="grid-background"></div>

    <div id="hud-container">
        <div class="hud-item">
            <span class="label">SCORE NIRD</span>
            <span id="score-display" class="value">00000</span>
        </div>
        <div class="hud-item">
            <span class="label">TEMPS RESTANT</span>
            <span id="time-display" class="value">03:00</span>
        </div>
        <div class="hud-item hud-health">
            <span class="label">MOTIVATION (SANTÉ)</span>
            <div id="motivation-bar-container">
                <div id="motivation-bar"></div>
            </div>
        </div>
    </div>

    <div id="game-area">
    </div>

    <div id="mode3-game-area" class="hidden">
        <canvas id="mode3-canvas"></canvas>
        <div id="mode3-hud">
            <div class="mode3-hud-item">
                <span class="label">SCORE</span>
                <span id="mode3-score" class="value">00000</span>
            </div>
            <div class="mode3-hud-item">
                <span class="label">MUNITIONS</span>
                <span id="mode3-ammo" class="value">∞</span>
            </div>
            <div class="mode3-hud-item">
                <span class="label">MICROBES ÉLIMINÉS</span>
                <span id="mode3-kills" class="value">00</span>
            </div>
        </div>
    </div>

    <div id="mode4-game-area" class="hidden">
        <canvas id="mode4-canvas"></canvas>
        <div id="mode4-hud">
            <div class="mode4-hud-item">
                <span class="label">NIVEAU</span>
                <span id="mode4-level" class="value">01</span>
            </div>
            <div class="mode4-hud-item">
                <span class="label">SCORE NIRD</span>
                <span id="mode4-score" class="value">00000</span>
            </div>
            <div class="mode4-hud-item mode4-health">
                <span class="label">VIES</span>
                <span id="mode4-lives" class="value">💖💖💖</span>
            </div>
            <div class="mode4-hud-item">
                <span class="label">OBJECTIF</span>
                <span id="mode4-objective" class="value">00</span>
            </div>
        </div>

        <div id="mode4-level-complete" class="level-complete-overlay hidden">
            <div class="level-complete-content">
                <h2 id="level-complete-title">NIVEAU ACCOMPLI !</h2>
                <p id="level-complete-score">Score actuel: 00000</p>
                <p id="level-complete-message">Bien joué ! Continuez votre progression vers le sommet de la Tour NIRD.
                </p>
                <button onclick="nextLevel()">NIVEAU SUIVANT</button>
            </div>
        </div>
    </div>


    <div id="nird-popup" class="hidden">
        <div class="popup-content">
            <h3 id="popup-title">TITRE</h3>
            <p id="popup-text">MESSAGE</p>
            <button onclick="closeNirdPopup()">CONTINUER LA MISSION</button>
        </div>
    </div>

    <div id="nird-quiz-overlay" class="hidden">
        <div id="quiz-content" class="quiz-container">
        </div>
    </div>

    <div id="message-overlay">
        <h1>LA ZERGUÈM DE LA NUIT</h1>
        <p>
            Bienvenue, Agent NIRD (Numérique, Information, Réflexion, Décision). Votre mission :
            renforcer votre esprit critique face aux menaces numériques (désinformation, pièges).
            Choisissez votre mode d'entraînement pour commencer.
        </p>
        <div class="mode-selector">
            <button onclick="startGame(1)" class="mode-btn">MODE 1: CLASSIQUE</button>
            <button onclick="startGame(2)" class="mode-btn">MODE 2: SURVIE</button>
            <button onclick="startGame(3)" class="mode-btn mode-3-btn">MODE 3: LASER GAME</button>
            <button onclick="startGame(4)" class="mode-btn mode-4-btn">MODE 4: PROGRESSION TOWER</button>
        </div>
        <div class="instruction-note">
            <p><strong>Note:</strong> Ce jeu nécessite l'audio (Impact.mp3, Miss.mp3, Pain.mp3) pour une immersion
                complète.</p>
        </div>
        <a style="color: white;" href="views/lazerguem/documentation.php" target="_blank">Aide / Activer la Mission</a>
    </div>

    <div id="score-table-overlay" class="hidden">
        <h2>MISSION ACCOMPLIE !</h2>
        <h3 id="final-score">Score final: 00000</h3>
        <div class="score-card">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>AGENT NIRD</th>
                        <th>SCORE</th>
                        <th>MODE</th>
                    </tr>
                </thead>
                <tbody id="high-scores-body">
                </tbody>
            </table>
        </div>
        <button onclick="window.location.reload()">NOUVELLE MISSION</button>
    </div>


    <audio id="sound-hit" src="public/assets/sounds/game-over-arcade-6435.mp3" preload="auto"></audio>
    <audio id="sound-miss" src="public/assets/sounds/arcade-ui-1-229498.mp3" preload="auto"></audio>
    <audio id="sound-pain" src="public/assets/sounds/game-over-arcade-6435.mp3" preload="auto"></audio>
    <audio id="sound-jingle" src="public/assets/sounds/retro-game-jingleaif-14638.mp3" preload="auto"></audio>

    <script src="public/javascript/lazerguem.js"></script>

</body>

</html>