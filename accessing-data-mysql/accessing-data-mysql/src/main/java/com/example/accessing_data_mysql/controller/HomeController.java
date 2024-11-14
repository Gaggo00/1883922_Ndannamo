package com.example.accessing_data_mysql.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/index")
    public String home() {
        return "Welcome in the index";
    }

    @GetMapping("/secured")
    public String secured() {
        return "Hello, secured!";
    }
}
