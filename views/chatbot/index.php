<form method="POST" action="index.php?controller=chatbot&action=send" id="chatForm">
    <input type="text" name="message" placeholder="Écrivez un message…" required>
    <button type="submit">Envoyer</button>
</form>

<?php if (isset($answer)): ?>
    <h3>Réponse :</h3>
    <div id="chatbotResponse" style="background:#eee;padding:10px;min-height:50px"></div>

    <script>
        const text = <?= json_encode($answer) ?>;
        const container = document.getElementById('chatbotResponse');

        let i = 0;
        let tickSound = new Audio('assets/sounds/animal-crossing.mp3');
        tickSound.loop = true;
        let isPlaying = false;

        function playNote() {
            if (!isPlaying) {
                tickSound.currentTime = 0;
                tickSound.play();
                isPlaying = true;
            }
        }

        function stopNote() {
            if (isPlaying) {
                tickSound.pause();
                tickSound.currentTime = 0;
                isPlaying = false;
            }
        }

        function typeWriter() {
            if (i < text.length) {
                if (!isPlaying) playNote();

                container.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                stopNote();
            }
        }
        typeWriter();
    </script>
<?php endif; ?>