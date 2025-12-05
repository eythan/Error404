<?php
session_start();

$controller = $_GET['controller'] ?? 'main';
$action = $_GET['action'] ?? 'index';

if ($controller == 'main') {
    require 'controllers/MainController.php';
} elseif ($controller == 'chatbot') {
    require 'controllers/ChatBotController.php';
} 
else {
    echo "Controller non trouvé";
}

