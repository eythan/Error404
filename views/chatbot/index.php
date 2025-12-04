<form method="POST" action="index.php?controller=chatbot&action=send" id="chatForm">
    <input type="text" name="message" placeholder="Écrivez un message…">
    <button type="submit">Envoyer</button>
</form>

<?php if (isset($answer)): ?>
    <?php
    if (preg_match('/```json\s*(\{.*\})\s*```/s', $answer, $matches)) {
        $jsonString = $matches[1];
        $decoded = json_decode($jsonString, true);
        $reponseText = $decoded['reponse'] ?? "PhiloBidon médite en silence…";
    } else {
        $reponseText = trim($answer, "` \n\r\t");
    }
    ?>
    <h3>Réponse :</h3>
    <div id="chatbotResponse" style="background:#eee;padding:10px;min-height:50px"></div>

    <script>
        const text = <?= json_encode($reponseText) ?>;
        const container = document.getElementById('chatbotResponse');

        let i = 0;
        const tickSound = new Audio('assets/sounds/animal-crossing.mp3');
        tickSound.volume = 0.5;
        tickSound.loop = true;

        function typeWriter() {
            if (i < text.length) {
                if (tickSound.paused) {
                    tickSound.currentTime = 0;
                    tickSound.play();
                }

                container.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                tickSound.pause();
                tickSound.currentTime = 0;
            }
        }

        typeWriter();
    </script>
<?php endif; ?>