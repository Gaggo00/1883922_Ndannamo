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
import com.example.backend.dto.OvernightStayDTO;
import com.example.backend.dto.TravelCreationRequest;
import com.example.backend.dto.TripCreationRequest;
import com.example.backend.dto.TripDTO;
import com.example.backend.dto.TripInviteList;
import com.example.backend.model.OvernightStay;
import com.example.backend.model.Trip;  
import com.example.backend.service.TripService;
import com.example.backend.service.UserService;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/trips")
public class TripController {

    private final TripService tripService;
    //private final UserService userService;

    @Autowired
    public TripController(TripService tripService /*, UserService userService*/) {
        this.tripService = tripService;
        //this.userService = userService;
    }

    // Crea una trip
    @PostMapping(value={"", "/"})
    public ResponseEntity<?> createTrip(@Valid @RequestBody TripCreationRequest tripRequest) {
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



    // Crea overnight stay
    @PostMapping(value={"/{id}/schedule/overnightstay", "/{id}/schedule/overnightstay/"})
    public ResponseEntity<?> createOvernightStay(@PathVariable Long id, @Valid @RequestBody OvernightStayDTO overnightStayDTO) {
        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // crea overnight stay
            OvernightStay overnightStay = tripService.createOvernightStay(email, id, overnightStayDTO);
            return ResponseEntity.ok().body(overnightStay.getId());
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
            // prendi l'utente dal toke
            System.out.println("Dati ricevuti per creare la spesa: " + expenseCreationRequest);
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // crea spesa
            String res = tripService.createExpense(email, id, expenseCreationRequest);
            return ResponseEntity.ok().body(res);
        }
        catch (Exception ex) {
            System.out.println("Error creating expense: " + ex.getMessage());
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
            System.out.println("Error creating expense: " + ex.getMessage());
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

    //***** OVERNIGHT STAY:

    // Modifica overnight stay
    @PutMapping(value={"/{id}/schedule/overnightstay", "/{id}/schedule/overnightstay/"})
    public ResponseEntity<?> editOvernightStay(@PathVariable Long id, @Valid @RequestBody OvernightStayDTO overnightStayDTO) {
        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // modifica overnight stay
            OvernightStay overnightStay = tripService.editOvernightStay(email, id, overnightStayDTO);
            return ResponseEntity.ok().body(overnightStay.getId());
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }


    //***** ACTIVITY:

    // Cambia posto activity
    @PutMapping(value={"/{id}/schedule/activity/{activity_id}/place", "/{id}/schedule/activity/{activity_id}/place/"})
    public ResponseEntity<?> changeActivityPlace(@PathVariable Long id, @PathVariable Long activity_id, @Valid @RequestBody GenericType<String> newPlace) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le info
            tripService.changeActivityPlace(email, id, activity_id, newPlace.getValue());
            return ResponseEntity.ok().body("Activity place changed");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Cambia data activity
    @PutMapping(value={"/{id}/schedule/activity/{activity_id}/date", "/{id}/schedule/activity/{activity_id}/date/"})
    public ResponseEntity<?> changeActivityDate(@PathVariable Long id, @PathVariable Long activity_id, @Valid @RequestBody GenericType<LocalDate> newDate) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le info
            tripService.changeActivityDate(email, id, activity_id, newDate.getValue());
            return ResponseEntity.ok().body("Activity date changed");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Cambia nome activity
    @PutMapping(value={"/{id}/schedule/activity/{activity_id}/name", "/{id}/schedule/activity/{activity_id}/name/"})
    public ResponseEntity<?> changeActivityName(@PathVariable Long id, @PathVariable Long activity_id, @Valid @RequestBody GenericType<String> newName) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le info
            tripService.changeActivityName(email, id, activity_id, newName.getValue());
            return ResponseEntity.ok().body("Activity name changed");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Cambia indirizzo activity
    @PutMapping(value={"/{id}/schedule/activity/{activity_id}/address", "/{id}/schedule/activity/{activity_id}/address/"})
    public ResponseEntity<?> changeActivityAddress(@PathVariable Long id, @PathVariable Long activity_id, @Valid @RequestBody GenericType<String> newAddress) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le info
            tripService.changeActivityAddress(email, id, activity_id, newAddress.getValue());
            return ResponseEntity.ok().body("Activity address changed");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Cambia orario activity
    @PutMapping(value={"/{id}/schedule/activity/{activity_id}/time", "/{id}/schedule/activity/{activity_id}/time/"})
    public ResponseEntity<?> changeActivityTime(@PathVariable Long id, @PathVariable Long activity_id, @Valid @RequestBody GenericList<String> time) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le info
            tripService.changeActivityTime(email, id, activity_id, time.getValue());
            return ResponseEntity.ok().body("Activity time changed");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Cambia info activity
    @PutMapping(value={"/{id}/schedule/activity/{activity_id}/info", "/{id}/schedule/activity/{activity_id}/info/"})
    public ResponseEntity<?> changeActivityInfo(@PathVariable Long id, @PathVariable Long activity_id, @Valid @RequestBody GenericType<String> newInfo) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le info
            tripService.changeActivityInfo(email, id, activity_id, newInfo.getValue());
            return ResponseEntity.ok().body("Activity info changed");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }


    //***** TRAVEL:

    // Cambia posto travel
    @PutMapping(value={"/{id}/schedule/travel/{travel_id}/place", "/{id}/schedule/travel/{travel_id}/place/"})
    public ResponseEntity<?> changeTravelPlace(@PathVariable Long id, @PathVariable Long travel_id, @Valid @RequestBody GenericType<String> newPlace) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le info
            tripService.changeTravelPlace(email, id, travel_id, newPlace.getValue());
            return ResponseEntity.ok().body("Travel place changed");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Cambia destinazione travel
    @PutMapping(value={"/{id}/schedule/travel/{travel_id}/destination", "/{id}/schedule/travel/{travel_id}/destination/"})
    public ResponseEntity<?> changeTravelDestination(@PathVariable Long id, @PathVariable Long travel_id, @Valid @RequestBody GenericType<String> newDestination) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le info
            tripService.changeTravelDestination(email, id, travel_id, newDestination.getValue());
            return ResponseEntity.ok().body("Travel destination changed");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Cambia data travel
    @PutMapping(value={"/{id}/schedule/travel/{travel_id}/date", "/{id}/schedule/travel/{travel_id}/date/"})
    public ResponseEntity<?> changeTravelDate(@PathVariable Long id, @PathVariable Long travel_id, @Valid @RequestBody GenericType<LocalDate> newDate) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le info
            tripService.changeTravelDate(email, id, travel_id, newDate.getValue());
            return ResponseEntity.ok().body("Travel date changed");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Cambia data di arrivo travel
    @PutMapping(value={"/{id}/schedule/travel/{travel_id}/arrivaldate", "/{id}/schedule/travel/{travel_id}/arrivaldate/"})
    public ResponseEntity<?> changeTravelArrivalDate(@PathVariable Long id, @PathVariable Long travel_id, @Valid @RequestBody GenericType<LocalDate> newDate) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le info
            tripService.changeTravelArrivalDate(email, id, travel_id, newDate.getValue());
            return ResponseEntity.ok().body("Travel arrival date changed");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Cambia indirizzo travel
    @PutMapping(value={"/{id}/schedule/travel/{travel_id}/address", "/{id}/schedule/travel/{travel_id}/address/"})
    public ResponseEntity<?> changeTravelAddress(@PathVariable Long id, @PathVariable Long travel_id, @Valid @RequestBody GenericType<String> newAddress) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le info
            tripService.changeTravelAddress(email, id, travel_id, newAddress.getValue());
            return ResponseEntity.ok().body("Travel info changed");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Cambia orario travel
    @PutMapping(value={"/{id}/schedule/travel/{travel_id}/time", "/{id}/schedule/travel/{travel_id}/time/"})
    public ResponseEntity<?> changeTravelTime(@PathVariable Long id, @PathVariable Long travel_id, @Valid @RequestBody GenericList<String> time) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le info
            tripService.changeTravelTime(email, id, travel_id, time.getValue());
            return ResponseEntity.ok().body("Travel time changed");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Cambia info travel
    @PutMapping(value={"/{id}/schedule/travel/{travel_id}/info", "/{id}/schedule/travel/{travel_id}/info/"})
    public ResponseEntity<?> changeTravelInfo(@PathVariable Long id, @PathVariable Long travel_id, @Valid @RequestBody GenericType<String> newTitle) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le info
            tripService.changeTravelInfo(email, id, travel_id, newTitle.getValue());
            return ResponseEntity.ok().body("Travel info changed");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }


    //***** NIGHT:


    // Cambia posto night
    @PutMapping(value={"/{id}/schedule/night/{night_id}/place", "/{id}/schedule/night/{night_id}/place/"})
    public ResponseEntity<?> changeNightPlace(@PathVariable Long id, @PathVariable Long night_id, @Valid @RequestBody GenericType<String> newPlace) {

        try {
            // prendi l'utente dal token
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // cambia le info
            tripService.changeNightPlace(email, id, night_id, newPlace.getValue());
            return ResponseEntity.ok().body("Night place changed");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

}
