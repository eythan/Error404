<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>PhiloBidon - Chatbot</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
    <style>
        body { 
            font-family: 'Roboto', sans-serif; 
            background: #f4f4f8; 
            margin: 0;
            height: 100vh;
        }

        button, input, .chat-toggle {
            user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
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
            background: #6c5ce7;
            color: #fff;
            padding: 15px 20px;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 6px 15px rgba(0,0,0,0.15);
            font-weight: bold;
            z-index: 999;
        }

        .chat-container { 
            background: #fff; 
            width: 400px; 
            max-width: 90%; 
            border-radius: 10px; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
            display: flex; 
            flex-direction: column; 
            overflow: hidden; 
            position: fixed;
            bottom: 80px; 
            right: 20px;
            display: none;
            z-index: 998;
        }

        .chat-header { 
            background: #6c5ce7; 
            color: #fff; 
            padding: 15px; 
            text-align: center; 
            font-weight: bold; 
            font-size: 1.2em; 
        }

        .chat-body { 
            padding: 15px; 
            flex: 1; 
            max-height: 500px;
            overflow-y: auto;
            display: flex; 
            flex-direction: column; 
            gap: 10px; 
        }

        .message-container { 
            display: flex; 
            gap: 10px; 
            align-items: flex-start; 
            justify-content: flex-start;
        }

        .name-label { 
            font-size: 0.8em; 
            font-weight: bold; 
            margin-bottom: 3px; 
        }

        .message { 
            padding: 10px 15px; 
            border-radius: 20px; 
            max-width: 70%; 
            word-wrap: break-word; 
        }

        .user-message { 
            background: #dfe6e9; 
            color: #000; 
        }

        .bot-message { 
            background: #74b9ff; 
            color: #fff; 
        }

        .chat-footer { 
            display: flex; 
            border-top: 1px solid #ccc; 
        }

        .chat-footer input[type="text"] { 
            flex: 1; 
            padding: 10px 15px; 
            border: none; 
            outline: none; 
            font-size: 1em; 
        }

        .chat-footer button { 
            background: #6c5ce7; 
            color: #fff; 
            border: none; 
            padding: 10px 20px; 
            cursor: pointer; 
        }

        .chat-footer button:hover { 
            background: #5a4bd6; 
        }
    </style>
</head>

<body>

<div class="chat-toggle" id="chatToggle">💬 Chat</div>

<div class="chat-container" id="chatBox">
    <div class="chat-header">PhiloBidon 🤔</div>
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
        
        const data = await response.json();

        const text = data.reponse;
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
                setTimeout(typeWriter, 40);
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
