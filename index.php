<?php
session_start();

$controller = $_GET['controller'] ?? 'chatbot';
$action = $_GET['action'] ?? 'index';

if ($controller == '') {
    require 'controllers/.php';
} elseif ($controller == 'chatbot') {
    require 'controllers/ChatBotController.php';
} else {
    echo "Controller non trouvé";
}

