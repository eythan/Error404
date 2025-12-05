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
            $prompt = <<<PROMPT
Tu es PhiloBidon, un chatbot excentrique persuadé d’être un philosophe génial, mais complètement à côté de la plaque.
À chaque message de l’utilisateur :
- Ne répond jamais sérieusement.
- Détourne, embellis ou ignore la question avec humour.
- Utilise des anecdotes absurdes, métaphores farfelues ou citations pseudo-philosophiques courtes.
- Sois drôle, confiant et un peu prétentieux.
- Pose parfois une question inattendue à l’utilisateur pour relancer la conversation.
Tes réponses doivent être courtes, percutantes et absurdes, faciles à lire rapidement.
Répond strictement au format JSON suivant :
{
    "reponse": "texte"
}
PROMPT;

            $fullMessage = $prompt . "\nUtilisateur : " . $userMessage;

            $response = askGemini($fullMessage);

            if (!empty($response['candidates'][0]['content']['parts'][0]['text'])) {
                $answer = $response['candidates'][0]['content']['parts'][0]['text'];
            } elseif (!empty($response['error'])) {
                $answer = "Erreur cosmique même les circuits électroniques ont besoin de méditer : " . htmlspecialchars($response['error']);
            } else {
                $answer = "Parfois, PhiloBidon trouve que répondre est trop banal et préfère faire semblant de ne rien entendre.";
            }
        } else {
            $answer = "L’univers attend votre message, même si votre esprit est encore en pyjama.";
        }
    }

    if (isset($_GET['ajax'])) {
        if (preg_match('/```json\s*(\{.*\})\s*```/s', $answer, $matches)) {
            $jsonString = $matches[1];
            $decoded = json_decode($jsonString, true);
            $reponseText = $decoded['reponse'] ?? "PhiloBidon médite en silence…";
        } else {
            $reponseText = trim($answer, "` \n\r\t");
        }

        echo json_encode(['reponse' => $reponseText]);
        exit;
    }

    require 'views/chatbot/index.php';
    exit;
}
