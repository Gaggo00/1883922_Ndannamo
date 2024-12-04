

package com.example.backend.controller;

import com.example.backend.model.Trip;
import com.example.backend.model.User;
import com.example.backend.service.JwtService;
import com.example.backend.service.TripService;


@RestController
@RequestMapping("/api/trip")
public class TripController {
    private final TripService tripService;
    private final UserService userService;
    private final JwtService jwtService;

    @Autowired
    public TripController(TripService tripService, UserService userService, JwtService jwtService) {
        this.tripService = tripService;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/create")
    public ResponseEntity<?> createTrip(@Valid @RequestBody Trip trip, @RequestHeader("Authorization") String token) {
        try {
            final String email = jwtService.extractEmail(token);
            final User user = userService.getUserByEmail(email);
            trip.setCreated_by(user);
            return ResponseEntity.ok(tripService.createTrip(trip));
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/get")
    public ResponseEntity<?> getTrip(@RequestParam long id) {
        try {
            return ResponseEntity.ok(tripService.getTrip(id));
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/get-all")
    public ResponseEntity<?> getAllTrips() {
        try {
            return ResponseEntity.ok(tripService.getAllTrips());
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/add-participant")
    public ResponseEntity<?> addParticipant(@RequestParam long tripId, @RequestParam String email) {
        try {
            return ResponseEntity.ok(tripService.addParticipant(tripId, email));
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/remove-participant")
    public ResponseEntity<?> removeParticipant(@RequestParam long tripId, @RequestParam String email) {
        try {
            return ResponseEntity.ok(tripService.removeParticipant(tripId, email));
        }
        catch (Exception ex