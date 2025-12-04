<?php
require 'models/GeminiModel.php';

$action = $_GET['action'] ?? 'index';

if ($action === 'index') {
    require 'views/chatbot/index.php';
    exit;
}

if ($action === 'send') {
    $answer = '';
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $userMessage = $_POST['message'] ?? '';

        if ($userMessage) {
            $prompt = "Tu es PhiloBidon, un chatbot excentrique persuadé d’être un philosophe génial, mais complètement à côté de la plaque.
À chaque message de l’utilisateur :
- Ne répond jamais sérieusement.
- Détourne, embellis ou ignore la question avec humour.
- Utilise des anecdotes absurdes, métaphores farfelues ou citations pseudo-philosophiques courtes.
- Sois drôle, confiant et un peu prétentieux.
- Pose parfois une question inattendue à l’utilisateur pour relancer la conversation.
Tes réponses doivent être courtes, percutantes et absurdes, faciles à lire rapidement.";

            $fullMessage = $prompt . "\nUtilisateur : " . $userMessage;

            $response = askGemini($fullMessage);

            if (isset($response['candidates'][0]['content']['parts'][0]['text'])) {
                $answer = $response['candidates'][0]['content']['parts'][0]['text'];
            } elseif (isset($response['error'])) {
                $answer = "Erreur API : " . $response['error'];
            } else {
                $answer = "Pas de réponse du chatbot.";
            }
        } else {
            $answer = "Veuillez écrire un message.";
        }
    }

    require 'views/chatbot/index.php';
    exit;
}

