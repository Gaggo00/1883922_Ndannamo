package com.example.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import com.example.backend.dto.ActivityCreationRequest;
import com.example.backend.dto.EventDTO;
import com.example.backend.dto.ExpenseCreationRequest;
import com.example.backend.dto.ExpenseDTO;
import com.example.backend.dto.GenericList;
import com.example.backend.dto.GenericType;
import com.example.backend.dto.TravelCreationRequest;
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

    // Crea una trip
    @PostMapping(value={"", "/"})
    public ResponseEntity<?> createTrip(@Valid @RequestBody TripCreationRequest tripRequest) {
        
        // controlla validita' dell'input
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

    
    // Ottieni tutte le trip dell'utente loggato
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




    /****************************************** SCHEDULE ******************************************/

    // Ottieni schedule della trip
    @GetMapping(value={"/{id}/schedule", "/{id}/schedule/"})
    public ResponseEntity<?> getSchedule(@PathVariable Long id) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // ottieni la schedule
            List<EventDTO> scheduleDTO = tripService.getSchedule(email, id);
            return ResponseEntity.ok().body(scheduleDTO);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }


    // Crea activity
    @PostMapping(value={"/{id}/schedule/activity", "/{id}/schedule/activity/"})
    public ResponseEntity<?> createActivity(@PathVariable Long id, @Valid @RequestBody ActivityCreationRequest activityCreationRequest) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // crea activity
            Long activityId = tripService.createActivity(email, id, activityCreationRequest);
            return ResponseEntity.ok().body(activityId);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Elimina activity
    @DeleteMapping(value={"/{id}/schedule/activity/{activity_id}", "/{id}/schedule/activity/{activity_id}/"})
    public ResponseEntity<?> deleteActivity(@PathVariable Long id, @PathVariable Long activity_id) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // elimina activity
            String res = tripService.deleteActivity(email, id, activity_id);
            return ResponseEntity.ok().body(res);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Crea travel
    @PostMapping(value={"/{id}/schedule/travel", "/{id}/schedule/travel/"})
    public ResponseEntity<?> createTravel(@PathVariable Long id, @Valid @RequestBody TravelCreationRequest travelCreationRequest) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // crea travel
            Long travelId = tripService.createTravel(email, id, travelCreationRequest);
            return ResponseEntity.ok().body(travelId);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Elimina travel
    @DeleteMapping(value={"/{id}/schedule/travel/{travel_id}", "/{id}/schedule/travel/{travel_id}/"})
    public ResponseEntity<?> deleteTravel(@PathVariable Long id, @PathVariable Long travel_id) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // elimina travel
            String res = tripService.deleteTravel(email, id, travel_id);
            return ResponseEntity.ok().body(res);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }



    /****************************************** GESTIONE SPESE ******************************************/


    // Ottieni tutte le spese della trip
    @GetMapping(value={"/{id}/expenses", "/{id}/expenses/"})
    public ResponseEntity<?> getExpenses(@PathVariable Long id) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // ottieni le spese
            List<ExpenseDTO> expensesDTO = tripService.getExpenses(email, id);
            return ResponseEntity.ok().body(expensesDTO);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Crea nuova spesa
    @PostMapping(value={"/{id}/expenses", "/{id}/expenses/"})
    public ResponseEntity<?> createExpense(@PathVariable Long id, @Valid @RequestBody ExpenseCreationRequest expenseCreationRequest) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // crea spesa
            String res = tripService.createExpense(email, id, expenseCreationRequest);
            return ResponseEntity.ok().body(res);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Elimina una spesa
    @DeleteMapping(value={"/{id}/expenses/{expense_id}", "/{id}/expenses/{expense_id}/"})
    public ResponseEntity<?> deleteExpense(@PathVariable Long id, @PathVariable Long expense_id) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // elimina spesa
            boolean res = tripService.deleteExpense(email, id, expense_id);
            return ResponseEntity.ok().body(res);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }



    /****************************************** CAMBIAMENTO DATI TRIP ******************************************/


    // Cambia titolo
    @PutMapping(value={"/{id}/title", "/{id}/title/"})
    public ResponseEntity<?> changeTitle(@PathVariable Long id, @Valid @RequestBody GenericType<String> newTitle) {
        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia il titolo
            tripService.changeTitle(email, id, newTitle.getValue());
            return ResponseEntity.ok().body("Title changed");
    
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Cambia date
    @PutMapping(value={"/{id}/dates", "/{id}/dates/"})
    public ResponseEntity<?> changeDates(@PathVariable Long id, @Valid @RequestBody GenericList<LocalDate> newDates) {
        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le date
            tripService.changeDates(email, id, newDates.getValue().get(0), newDates.getValue().get(1));
            return ResponseEntity.ok().body("Dates changed");
    
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Cambia destinazioni
    @PutMapping(value={"/{id}/locations", "/{id}/locations/"})
    public ResponseEntity<?> changeLocations(@PathVariable Long id, @Valid @RequestBody GenericList<String> newLocations) {
        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le date
            tripService.changeLocations(email, id, newLocations.getValue());
            return ResponseEntity.ok().body("Locations changed");
    
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }



    
    
    
    /****************************************** CAMBIAMENTO DATI EVENTI ******************************************/

    // Cambia info activity
    @PutMapping(value={"/{id}/schedule/activity/{activity_id}/info", "/{id}/schedule/activity/{activity_id}/info/"})
    public ResponseEntity<?> changeActivityInfo(@PathVariable Long id, @PathVariable Long activity_id, @Valid @RequestBody GenericType<String> newTitle) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le info
            tripService.changeActivityInfo(email, id, activity_id, newTitle.getValue());
            return ResponseEntity.ok().body("Activity info changed");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }


}
