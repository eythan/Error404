<?php
session_start();

$controller = $_GET['controller'] ?? 'chatbot';
$action = $_GET['action'] ?? 'index';

if ($controller == 'main') {
    require 'controllers/MainController.php';
} elseif ($controller == 'chatbot') {
    require 'controllers/ChatBotController.php';
} 
else {
    echo "Controller non trouvé";
}

