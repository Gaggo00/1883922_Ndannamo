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

import com.example.backend.dto.TripCreationRequest;
import com.example.backend.dto.TripDTO;
import com.example.backend.dto.TripInviteList;
import com.example.backend.model.Trip;
import com.example.backend.service.TripService;
import com.example.backend.service.UserService;
import com.example.backend.utils.TripValidation;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/trips")
public class TripController {

    private final TripService tripService;
    //private final UserService userService;

    @Autowired
    public TripController(TripService tripService, UserService userService) {
        this.tripService = tripService;
        //this.userService = userService;
    }

    @PostMapping(value={"", "/"})
    public ResponseEntity<?> createTrip(@Valid @RequestBody TripCreationRequest tripRequest) {
        
        // controlla validita' delle date
        if (!TripValidation.tripValid(tripRequest)) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Invalid dates");
        }
        
        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            // crea trip
            final Trip trip = tripService.createTrip(email, tripRequest);
            return ResponseEntity.ok().body(trip.getId());
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    @GetMapping(value={"", "/"})
    public ResponseEntity<?> getAllTrips() {
        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            // ottieni trips
            final List<TripDTO> tripsDTO = tripService.getTripsOfUser(email);
            return ResponseEntity.ok().body(tripsDTO);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }


    // Ottieni info su una specifica trip
    @GetMapping(value={"/{id}", "/{id}/"})
    public ResponseEntity<?> getTrip(@PathVariable Long id) {
        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            // ottieni trip
            final TripDTO tripDTO = tripService.getTripDTOById(email, id);
            return ResponseEntity.ok().body(tripDTO);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }


    // Elimina una trip
    @DeleteMapping(value={"/{id}", "/{id}/"})
    public ResponseEntity<?> deleteTrip(@PathVariable Long id) {
        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            // elimina trip
            tripService.deleteTrip(email, id);
            return ResponseEntity.ok().body("Done");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }


    // Aggiungi persone a una trip
    @PostMapping(value={"/{id}/invite", "/{id}/invite/"})
    public ResponseEntity<?> inviteToTrip(@PathVariable Long id, @Valid @RequestBody TripInviteList inviteList) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // crea inviti
            String res = tripService.inviteToTrip(email, id, inviteList.getInviteList());
            return ResponseEntity.ok().body("Invitations sent, res = " + res);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }


    // Lascia una trip
    @GetMapping(value={"/{id}/leave", "/{id}/leave/"})
    public ResponseEntity<?> leaveTrip(@PathVariable Long id) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // lascia trip
            tripService.leaveTrip(email, id);
            return ResponseEntity.ok().body("Trip left");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }
}
