package com.example.authentication.controller;


import com.example.authentication.dto.LoginRequest;
//import com.example.authentication.dto.UserDTO;
//import com.example.authentication.dto.ChangePasswordRequest;
import com.example.authentication.model.User;
import com.example.authentication.service.JwtService;
import com.example.authentication.service.UserService;


import jakarta.validation.Valid;

import java.text.SimpleDateFormat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping("/prova")
    public ResponseEntity<?> prova() {
        User user = userService.getUserByEmail("anna@email.it");
        return ResponseEntity.ok().body(user);
    }

    @PostMapping(value={"/login", "/login/"})
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            final UserDetails userDetails = userService.getUserByEmail(loginRequest.getEmail());
            final String jwt = jwtService.generateToken(userDetails);

            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
            String expiration = simpleDateFormat.format(jwtService.extractExpiration(jwt));

            // Manda token e data di scadenza separati da virgola (tanto il token ha come caratteri solo lettere, numeri, punto e trattini, non virgola)
            return ResponseEntity.ok(jwt + "," + expiration);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    @PostMapping(value={"/register", "/register/"})
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        try {
            // registra il nuovo utente
            User registeredUser = userService.registerUser(user);

            // fai direttamente anche il login
            final UserDetails userDetails = userService.getUserByEmail(user.getEmail());
            final String jwt = jwtService.generateToken(userDetails);
            
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
            String expiration = simpleDateFormat.format(jwtService.extractExpiration(jwt));

            // Manda token e data di scadenza separati da virgola (tanto il token ha come caratteri solo lettere, numeri, punto e trattini, non virgola)
            return ResponseEntity.ok(jwt + "," + expiration);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }
}
