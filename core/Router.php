<?php

class Router {

    public function run() {
        $url = isset($_GET['url']) ? trim($_GET['url'], '/') : 'home';

        $params = explode('/', $url);

        $controllerName = ucfirst($params[0]) . 'Controller';
        $controllerPath = "app/controllers/$controllerName.php";

        if (!file_exists($controllerPath)) {
            die("Controller $controllerName introuvable.");
        }
        require_once $controllerPath;
        $controller = new $controllerName();

        $method = isset($params[1]) ? $params[1] : 'index';

        if (!method_exists($controller, $method)) {
            die("Méthode $method introuvable dans $controllerName");
        }

        $args = array_slice($params, 2);

        call_user_func_array([$controller, $method], $args);
    }
}
