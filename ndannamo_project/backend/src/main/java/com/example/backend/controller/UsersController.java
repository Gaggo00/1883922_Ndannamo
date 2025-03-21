package com.example.backend.controller;
import com.example.backend.dto.UserDTOSimple;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.security.access.AccessDeniedException;

import com.example.backend.dto.ChangePasswordRequest;
import com.example.backend.dto.GenericType;
import com.example.backend.service.TripService;
import com.example.backend.service.UserService;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/users")
public class UsersController {

    private final UserService userService;

    @Autowired
    public UsersController(UserService userService, TripService tripService) {
        this.userService = userService;
    }

    // All profile
    @GetMapping(value = {"", "/"})
    public ResponseEntity<List<UserDTOSimple>> getAllUsers() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                throw new AccessDeniedException("Utente non autenticato.");
            }

            List<UserDTOSimple> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        }
        catch (AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

        
    // Per vedere se un utente esiste
    @GetMapping(value={"/{email}/exists" , "/{email}/exists/"})
    public ResponseEntity<?> getUserExists(@PathVariable String email) {
        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                throw new AccessDeniedException("Must be logged in to do this operation");
            }

            // controlla se l'utente esiste
            return ResponseEntity.ok().body(userService.userExists(email));
    
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }


}
