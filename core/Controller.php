<?php

class Controller {

    public function view($view, $data = []) {
        extract($data);

        require "app/views/layouts/header.php";
        require "app/views/$view.php";
        require "app/views/layouts/footer.php";
    }

    public function model($model) {
        require_once "app/models/$model.php";
        return new $model();
    }
}
