<?php
session_start();

$controller = $_GET['controller'] ?? 'accueil';
$action = $_GET['action'] ?? 'index';

$controllerFile = __DIR__ . "/app/controllers/" . ucfirst($controller) . "Controller.php";
if (file_exists($controllerFile)) {
    require_once $controllerFile;
    $controllerClass = ucfirst($controller) . "Controller";
    if (class_exists($controllerClass)) {
        $ctrl = new $controllerClass();
        if (method_exists($ctrl, $action)) {
            $ctrl->$action();
        } else {
            echo "Action '$action' non trouvée dans $controllerClass";
        }
    } else {
        echo "Classe $controllerClass non trouvée";
    }
} else {
    echo "Controller non trouvé";
}
