package com.example.backend.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.example.backend.dto.TripCreationRequest;
import com.example.backend.dto.TripDTO;
import com.example.backend.model.Trip;
import com.example.backend.model.User;
import com.example.backend.service.TripService;
import com.example.backend.service.UserService;
import com.example.backend.utils.TripValidation;


@RestController
@RequestMapping("/trips")
public class TripController {

    private final AuthenticationManager authenticationManager;
    private final TripService tripService;
    //private final UserService userService;

    @Autowired
    public TripController(AuthenticationManager authenticationManager, TripService tripService, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.tripService = tripService;
        //this.userService = userService;
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/")
    public ResponseEntity<?> createTrip(@Valid @RequestBody TripCreationRequest tripRequest) {

        // @RequestHeader("Authorization") String token, 
        
        // controlla validita' delle date
        if (!TripValidation.tripValid(tripRequest)) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Invalid dates");
        }
        
        //authenticationManager.authenticate(new )
        //Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //User currentUser = (User) authentication.getPrincipal();

        //return ResponseEntity.ok().body("trip registrata correttamente");

        
        try {
            final Trip trip = tripService.createTrip(tripRequest);
            return ResponseEntity.ok("trip registrata correttamente, id: " + trip.getId() + "utente loggato id: " + currentUser.getId());
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("{id}")
    public ResponseEntity<String> getTrip(@PathVariable Long id) {

        try {
            final Trip trip = tripService.getTripById(id);
            return ResponseEntity.ok("trip trovata: " + trip.getTitle());
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }
}
