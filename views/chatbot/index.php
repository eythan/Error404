<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>PhiloBidon - Chatbot</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            height: 100vh;
            background: #0f0f0f;
            color: #fff;
        }

        button,
        input,
        .chat-toggle {
            user-select: none;
        }

        button:focus,
        input:focus,
        .chat-toggle:focus {
            outline: none;
        }

        .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #0080bf;
            color: #fff;
            padding: 12px 18px;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 0 6px rgba(0, 128, 191, 0.4);
            font-weight: bold;
            z-index: 999;
            transition: 0.2s;
        }

        .chat-toggle:hover {
            box-shadow: 0 0 10px rgba(0, 128, 191, 0.5);
        }

        .chat-container {
            background: #1b1b1b;
            width: 400px;
            max-width: 90%;
            border-radius: 12px;
            box-shadow: 0 0 15px rgba(0, 128, 191, 0.2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: fixed;
            bottom: 80px;
            right: 20px;
            display: none;
            z-index: 998;
            border: 1px solid #0080bf;
        }

        .chat-header {
            background: #00294d;
            color: #fff;
            padding: 12px;
            text-align: center;
            font-weight: bold;
            font-size: 1.2em;
        }

        .chat-body {
            padding: 12px;
            flex: 1;
            max-height: 400px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .message-container {
            display: flex;
            gap: 8px;
            align-items: flex-start;
            justify-content: flex-start;
        }

        .name-label {
            font-size: 0.8em;
            font-weight: bold;
            margin-bottom: 2px;
            color: #00bfff;
        }

        .message {
            padding: 8px 12px;
            border-radius: 16px;
            max-width: 70%;
            word-wrap: break-word;
        }

        .user-message {
            background: #2a2a2a;
            color: #fff;
            border: 1px solid #0080bf;
            box-shadow: 0 0 3px rgba(0, 128, 191, 0.3);
        }

        .bot-message {
            background: #004080;
            color: #fff;
            border: 1px solid #00bfff;
            box-shadow: 0 0 3px rgba(0, 191, 255, 0.3);
        }

        .chat-footer {
            display: flex;
            border-top: 1px solid #444;
        }

        .chat-footer input[type="text"] {
            flex: 1;
            padding: 10px 12px;
            border: none;
            outline: none;
            font-size: 1em;
            background: #111;
            color: #fff;
            border-right: 1px solid #444;
        }

        .chat-footer button {
            background: #0080bf;
            color: #fff;
            border: none;
            padding: 10px 18px;
            cursor: pointer;
            transition: 0.2s;
            box-shadow: 0 0 3px rgba(0, 128, 191, 0.3);
        }

        .chat-footer button:hover {
            box-shadow: 0 0 6px rgba(0, 128, 191, 0.4);
        }
    </style>
</head>

<body>

    <div class="chat-toggle" id="chatToggle">💬 Chat</div>

    <div class="chat-container" id="chatBox">
        <div class="chat-header">PhiloBidon 🤖</div>
        <div class="chat-body" id="chatBody"></div>

        <form id="chatForm" class="chat-footer">
            <input type="text" name="message" placeholder="Écrivez un message…" required>
            <button type="submit">Envoyer</button>
        </form>
    </div>

    <script>
        const chatToggle = document.getElementById('chatToggle');
        const chatBox = document.getElementById('chatBox');

        chatToggle.addEventListener('click', () => {
            const current = window.getComputedStyle(chatBox).display;
            chatBox.style.display = (current === 'none') ? 'flex' : 'none';
        });

        const chatBody = document.getElementById('chatBody');
        const form = document.getElementById('chatForm');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = form.querySelector('input[name="message"]');
            const message = input.value.trim();
            if (!message) return;

            const userContainer = document.createElement('div');
            userContainer.className = 'message-container user';
            userContainer.innerHTML = `<div><div class="name-label">Moi</div><div class="message user-message">${message}</div></div>`;
            chatBody.appendChild(userContainer);
            chatBody.scrollTop = chatBody.scrollHeight;

            input.value = '';
            input.disabled = true;

            const botContainer = document.createElement('div');
            botContainer.className = 'message-container bot';
            const botMessageDiv = document.createElement('div');
            botMessageDiv.innerHTML = `<div class="name-label">PhiloBidon</div><div class="message bot-message">...</div>`;
            botContainer.appendChild(botMessageDiv);
            chatBody.appendChild(botContainer);
            chatBody.scrollTop = chatBody.scrollHeight;

            try {
                const response = await fetch('index.php?controller=chatbot&action=send&ajax=1', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'message=' + encodeURIComponent(message)
                });

                const text = await response.text();
                let i = 0;
                const messageDiv = botMessageDiv.querySelector('.bot-message');

                const tickSound = new Audio('assets/sounds/animal-crossing.mp3');
                tickSound.volume = 0.5;
                tickSound.loop = true;

                function typeWriter() {
                    if (i < text.length) {
                        if (tickSound.paused) { tickSound.currentTime = 0; tickSound.play(); }
                        messageDiv.innerHTML += text.charAt(i);
                        i++;
                        chatBody.scrollTop = chatBody.scrollHeight;
                        setTimeout(typeWriter, 1);
                    } else {
                        tickSound.pause();
                        tickSound.currentTime = 0;
                    }
                }
                messageDiv.innerHTML = '';
                typeWriter();

            } catch (err) {
                const messageDiv = botMessageDiv.querySelector('.bot-message');
                messageDiv.textContent = "Erreur cosmique lors de la communication avec PhiloBidon.";
            } finally {
                input.disabled = false;
                input.focus();
            }
        });
    </script>

</body>

</html>