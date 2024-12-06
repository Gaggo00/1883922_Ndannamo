package com.example.backend.service;

import java.time.LocalDate;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.repositories.TripRepository;
import com.example.backend.repositories.UserRepository;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Trip;
import com.example.backend.model.User;
import com.example.backend.dto.TripCreationRequest;
import com.example.backend.dto.TripDTO;

@Service
public class TripService {
    
    private final TripRepository tripRepository;
    private final UserService userService;


    @Autowired
    public TripService(TripRepository tripRepository, UserService userService) {
        this.tripRepository = tripRepository;
        this.userService = userService;
    }
     
    public Trip createTrip(TripCreationRequest tripRequest) {
        // TODO: controllo validita' user (che l'user createdBy sia lo stesso utente loggato)
        // ...

        Trip trip = new Trip();

        trip.setTitle(tripRequest.getTitle());
        trip.setLocations(tripRequest.getLocations());
        trip.setStartDate(tripRequest.getStartDate());
        trip.setEndDate(tripRequest.getEndDate());

        User created_by = userService.getUserById(tripRequest.getCreatedBy());
        //User created_by = new User();   // TEMP perche' non ho i veri ID degli utenti per ora
        trip.setCreatedByUser(created_by);

        ArrayList<User> participants = new ArrayList<User>();
        participants.add(created_by);
        /*
        for (long id: tripRequest.getList_participants()) {
            User user = userService.getUserById(id);
            participants.add(user);
        }
        */
        
        trip.setParticipants(participants);

        return tripRepository.save(trip);
    }
    

    public Trip getTripById(long id) {
        // TODO: controllare che l'utente sia un participant della trip
        // ...
        return tripRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Trip not found!"));
    }
}
