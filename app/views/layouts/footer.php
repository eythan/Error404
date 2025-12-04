<!-- footer.php -->

<!-- HTML de l'overlay du jeu (caché par défaut par le CSS) -->
<div id="game-overlay">
    <div id="game-ui">
        <div id="game-title">SYSTEM HACKED: SNAKE PROTOCOL</div>
        <div id="score-board">SCORE: <span id="score">0</span></div>
    </div>
    <canvas id="snakeCanvas" width="400" height="400"></canvas>
    <button id="close-btn" onclick="closeGame()">FERMER LA SIMULATION</button>
</div>

<!-- Lien vers le fichier JavaScript pour la logique du jeu/Konami code -->
<script src="script.js"></script> 

<footer style="text-align:center; color:#fff; margin-top:40px; font-family:'VT323', monospace;">
    &copy; 2025 - NIRD - Résistance Numérique
</footer>

</body>
</html>