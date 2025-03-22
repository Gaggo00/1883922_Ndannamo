package com.example.chat.controller;

import com.example.chat.model.User;
import com.example.chat.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(value={"/", ""})
    public ResponseEntity<?> createUser(@Valid @RequestBody String request) {
        try {
            User createdUser = userService.createUser(
                request
            );
            return ResponseEntity.ok(createdUser);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
        }
    }


    @PostMapping(value={"/{id}", "{id}"})
    public ResponseEntity<?> checkCreateUser(@PathVariable String id) {
        try {
            User createdUser = userService.createUserIfNotExists(
                id
            );
            return ResponseEntity.ok(createdUser);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
        }
    }


    // Elimina un canale
    @DeleteMapping(value={"/{id}", "/{id}/"})
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().body("Done");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
        }
    }



}
