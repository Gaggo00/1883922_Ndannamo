package com.example.backend.controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.example.backend.dto.TripCreationRequest;
import com.example.backend.dto.TripDTO;
import com.example.backend.model.Trip;
import com.example.backend.service.JwtService;
import com.example.backend.service.TripService;
import com.example.backend.service.UserService;
import com.example.backend.utils.TripValidation;


@RestController
@RequestMapping("/trips")
public class TripController {

    private final JwtService jwtService;
    private final TripService tripService;
    //private final UserService userService;

    @Autowired
    public TripController(JwtService jwtService, TripService tripService, UserService userService) {
        this.jwtService = jwtService;
        this.tripService = tripService;
        //this.userService = userService;
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/")
    public ResponseEntity<?> createTrip(@RequestHeader("Authorization") String token, @Valid @RequestBody TripCreationRequest tripRequest) {
        
        // controlla validita' delle date
        if (!TripValidation.tripValid(tripRequest)) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Invalid dates");
        }
        
        try {
            // rimuovo "bearer " dalla stringa token -> DA CONTROLLARE se c'e' sempre scritto bearer o no
            token = token.substring("Bearer ".length());
            // estrai username dal token
            String username = jwtService.extractUsername(token);
            // crea trip
            final Trip trip = tripService.createTrip(username, tripRequest);
            return ResponseEntity.ok().body("trip registrata correttamente, id: " + trip.getId());
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/")
    public ResponseEntity<?> getAllTrips(@RequestHeader("Authorization") String token) {
    
        try {
            // rimuovo "bearer " dalla stringa token -> DA CONTROLLARE se c'e' sempre scritto bearer o no
            token = token.substring("Bearer ".length());
            // estrai username dal token
            String username = jwtService.extractUsername(token);
            // ottieni trips
            final List<TripDTO> tripsDTO = tripService.getTripsOfUser(username);
            return ResponseEntity.ok().body(tripsDTO);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }


    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{id}")
    public ResponseEntity<?> getTrip(@RequestHeader("Authorization") String token, @PathVariable Long id) {

        try {
            // rimuovo "bearer " dalla stringa token -> DA CONTROLLARE se c'e' sempre scritto bearer o no
            token = token.substring("Bearer ".length());
            // estrai username dal token
            String username = jwtService.extractUsername(token);
            // ottieni trip
            final TripDTO tripDTO = tripService.getTripById(username, id);
            return ResponseEntity.ok().body(tripDTO);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }


}
