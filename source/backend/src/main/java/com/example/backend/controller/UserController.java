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

import com.example.backend.dto.ChangePasswordRequest;
import com.example.backend.dto.GenericType;
import com.example.backend.service.ChatService;
import com.example.backend.service.TripService;
import com.example.backend.service.UserService;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/profile")
public class UserController {

    private final TripService tripService;
    private final UserService userService;
    private final ChatService chatService;

    @Autowired
    public UserController(UserService userService, TripService tripService, ChatService chatService) {
        this.tripService = tripService;
        this.userService = userService;
        this.chatService = chatService;
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
    public ResponseEntity<?> inviteToTrip(@PathVariable Long id, @Valid @RequestBody GenericType<Boolean> accept) {
        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // gestisci inviti
            tripService.manageInvitation(email, id, accept.getValue());

            String message = "Invitation ";
            if (accept.getValue()) {
                
                chatService.addParticipant(email, id);

                message += "accepted";
            }
            else message += "refused";
            return ResponseEntity.ok().body(message);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    

    /****************** FUNZIONI PER CAMBIARE I DATI DELL'UTENTE ******************/

    // Cambia password
    @PutMapping(value={"/password" , "/password/"})
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia la password
            userService.changePassword(email,request);
            return ResponseEntity.ok().body("Password changed");
    
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Cambia nickname
    @PutMapping(value={"/nickname" , "/nickname/"})
    public ResponseEntity<?> changeNickname(@Valid @RequestBody GenericType<String> newNickname) {
        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia la password
            userService.changeNickname(email, newNickname.getValue());
            return ResponseEntity.ok().body("Nickname changed");
    
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }
}
