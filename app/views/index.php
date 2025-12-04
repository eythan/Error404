<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NIRD - Résistance Numérique</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=VT323&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="app/views/styleGlobal.css">
</head>
<body>
    <?php include __DIR__ . '/layouts/header.php'; ?>
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
                >> Entrer les commandes pour réduire la dépendance... (Tapez <b>NIRD</b> pour le protocole secret !)
            </p>
        </div>
    </div>
    <div id="game-overlay" style="display:none;">
        <div id="game-ui">
            <div id="game-title">SYSTEM HACKED: SNAKE PROTOCOL</div>
            <div id="score-board">SCORE: <span id="score">0</span></div>
        </div>
        <canvas id="snakeCanvas" width="400" height="400"></canvas>
        <button id="close-btn" onclick="closeGame()">FERMER LA SIMULATION</button>
    </div>
    <script src="app/views/scriptJS"></script>
    <?php include __DIR__ . '/layouts/footer.php'; ?>
</body>
</html>