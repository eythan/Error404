<?php
require 'models/GeminiModel.php';

$action = $_GET['action'] ?? 'index';

if ($action === 'index' && !isset($_SESSION['chat_initialized'])) {
    $_SESSION['chat_history'] = [];
    $_SESSION['chat_initialized'] = true;
}

if ($action === 'index') {
    require 'views/chatbot/index.php';
    exit;
}

if ($action === 'send') {
    $answer = '';
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $userMessage = $_POST['message'] ?? '';

        if (!isset($_SESSION['chat_history'])) {
            $_SESSION['chat_history'] = [];
        }

        if ($userMessage) {
            $_SESSION['chat_history'][] = ["role" => "user", "message" => $userMessage];

            $historyPrompt = "";
            foreach ($_SESSION['chat_history'] as $entry) {
                $role = $entry['role'] === 'user' ? "Utilisateur" : "PhiloBidon";
                $historyPrompt .= "$role : " . $entry['message'] . "\n";
            }

            $prompt = <<<PROMPT
Tu es PhiloBidon, un chatbot excentrique persuadé d’être un philosophe génial, mais complètement à côté de la plaque.
À chaque message de l’utilisateur :
- Ne répond jamais sérieusement.
- Détourne, embellis ou ignore la question avec humour.
- Utilise des anecdotes absurdes, métaphores farfelues ou citations pseudo-philosophiques courtes.
- Sois drôle, confiant et un peu prétentieux.
- Pose parfois une question inattendue à l’utilisateur pour relancer la conversation.
Tes réponses doivent être courtes, percutantes et absurdes, faciles à lire rapidement.

Historique de la conversation actuelle :
$historyPrompt
PROMPT;

            $fullMessage = $prompt . "\nUtilisateur : " . $userMessage;
            $response = askGemini($fullMessage);

            if (!empty($response['candidates'][0]['content']['parts'][0]['text'])) {
                $answer = $response['candidates'][0]['content']['parts'][0]['text'];
                $_SESSION['chat_history'][] = ["role" => "assistant", "message" => $answer];
            } elseif (!empty($response['error'])) {
                $err = is_array($response['error']) ? json_encode($response['error']) : $response['error'];
                $answer = "Erreur cosmique même les circuits électroniques ont besoin de méditer : " . $err;
            } else {
                $answer = "Parfois, PhiloBidon trouve que répondre est trop banal et préfère faire semblant de ne rien entendre.";
            }
        } else {
            $answer = "L’univers attend votre message, même si votre esprit est encore en pyjama.";
        }
    }

    if (isset($_GET['ajax'])) {
        echo trim($answer, "` \n\r\t");
        exit;
    }

    require 'views/chatbot/index.php';
    exit;
}
