package com.example.authentication.controller;


import com.example.authentication.dto.LoginRequest;
import com.example.authentication.model.User;
import com.example.authentication.service.ChatService;
import com.example.authentication.service.JwtService;
import com.example.authentication.service.UserService;
import com.example.authentication.dto.TokenValidationResponse;

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
    private final ChatService chatService;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtService jwtService, ChatService chatService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
        this.chatService = chatService;
    }

    @GetMapping("/prova")
    public ResponseEntity<?> prova() {
        User user = userService.getUserByEmail("anna@email.it");
        return ResponseEntity.ok().body(user);
    }

    // Endpoint per la validazione del token
    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authorizationHeader) {
        // Controlla che l'header Authorization esista e inizi con "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwt = authorizationHeader.substring(7); // Estrai il token

            // Estrai il nome utente dal token
            String username = jwtService.extractUsername(jwt);
            try {
                // Recupera i dettagli dell'utente
                UserDetails userDetails = userService.getUserByEmail(username);
                
                // Verifica la validità del token
                if (jwtService.validateToken(jwt, userDetails)) {
                    TokenValidationResponse response = new TokenValidationResponse(true, username, "Valid");
                    return ResponseEntity.ok(response);
                } else {
                    TokenValidationResponse response = new TokenValidationResponse(false, "", "Token non valido");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                }
            } catch (Exception e) {
                TokenValidationResponse response = new TokenValidationResponse(false, "", "Errore durante la validazione del token: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Header Authorization mancante o mal formattato");
    }

    @PostMapping(value={"/login", "/login/"})
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            final UserDetails userDetails = userService.getUserByEmail(loginRequest.getEmail());
            final String jwt = jwtService.generateToken(userDetails);

            chatService.createUser(loginRequest.getEmail()); // L'utente viene creato solo se già non esiste

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
            
            chatService.createUser(user.getEmail()); // L'utente viene creato solo se già non esiste

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
