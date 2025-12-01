<?php

class ArticleController extends Controller {

    public function index() {
        $this->view("article", ["message" => "Test message mvc"]);
    }
}
