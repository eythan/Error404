<?php
session_start();

$controller = $_GET['controller'] ?? 'main';
$action = $_GET['action'] ?? 'index';

if ($controller == 'main') {
    require 'controllers/MainController.php';
} elseif ($controller == 'chatbot') {
    require 'controllers/ChatBotController.php';
} elseif ($controller == 'lazerguem') {
    require 'controllers/LazerguemController.php';
} elseif ($controller == 'computer') {
    require 'controllers/ComputerController.php';
} elseif ($controller == 'hiddensnake') {
    require 'controllers/HiddenSnakeController.php';
}else {
    echo "Controller non trouvé";
}

