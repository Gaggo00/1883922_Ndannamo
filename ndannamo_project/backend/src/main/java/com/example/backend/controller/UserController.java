package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.example.backend.dto.BooleanDTO;
import com.example.backend.service.TripService;
import com.example.backend.service.UserService;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/profile")
public class UserController {

    private final TripService tripService;
    private final UserService userService;

    @Autowired
    public UserController(UserService userService, TripService tripService) {
        this.tripService = tripService;
        this.userService = userService;
    }


    // Profilo
    @GetMapping(value={"", "/"})
    public ResponseEntity<?> getProfile() {
        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            return ResponseEntity.ok(userService.getUserDTOByEmail(email));
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }


    // Accetta o rifiuta un invito
    @PostMapping(value={"/invitations/{id}", "/invitations/{id}/"})
    public ResponseEntity<?> inviteToTrip(@PathVariable Long id, @Valid @RequestBody BooleanDTO accept) {
        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // gestisci inviti
            tripService.manageInvitation(email, id, accept.getValue());

            String message = "Invitation ";
            if (accept.getValue()) message += "accepted";
            else message += "refused";
            return ResponseEntity.ok().body(message);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }
}
