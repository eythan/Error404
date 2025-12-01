<?php

class HomeController extends Controller {

    public function index() {
        $this->view("home", ["message" => "Test message mvc"]);
    }

    public function contact() {
        $this->view("contact");
    }
}
