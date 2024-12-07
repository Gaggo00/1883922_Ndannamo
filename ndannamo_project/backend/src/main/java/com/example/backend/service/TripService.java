package com.example.backend.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import com.example.backend.mapper.TripMapperImpl;

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
    private final TripMapperImpl tripMapper;

    @Autowired
    public TripService(TripRepository tripRepository, UserService userService, TripMapperImpl tripMapper) {
        this.tripRepository = tripRepository;
        this.userService = userService;
        this.tripMapper = tripMapper;
    }
     
    public Trip createTrip(String username, TripCreationRequest tripRequest) {
        // Ottieni user dall'username
        User logged_user = userService.getUserByEmail(username);

        Trip trip = new Trip();

        trip.setTitle(tripRequest.getTitle());
        trip.setLocations(tripRequest.getLocations());
        trip.setCreationDate(LocalDate.now());
        trip.setStartDate(tripRequest.getStartDate());
        trip.setEndDate(tripRequest.getEndDate());

        //trip.setCreatedByUser(logged_user);
        trip.setCreated_by(logged_user);

        ArrayList<User> participants = new ArrayList<User>();
        participants.add(logged_user);

        trip.setParticipants(participants);

        return tripRepository.save(trip);
    }
    

    public List<TripDTO> getTripsOfUser(String username) {

        // Ottengo l'utente loggato
        User logged_user = userService.getUserByEmail(username);

        // Prendo le trip dell'utente loggato
        List<Trip> trips = logged_user.getTrips();

        // Converto la lista di Trip in lista di TripDTO
        List<TripDTO> tripsDTO = trips.stream()
            .map(trip -> tripMapper.toDTO(trip))
            .collect(Collectors.toList());

        return tripsDTO;
    }


    public TripDTO getTripById(String username, long id) {

        Trip trip = tripRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Trip not found!"));

        // Controllo che l'utente loggato sia un participant della trip
        User logged_user = userService.getUserByEmail(username);
        if (!trip.getParticipants().contains(logged_user)) {
            throw new ResourceNotFoundException("Trip not found!");
        }

        // Converti Trip in TripDTO
        TripDTO tripDTO = tripMapper.toDTO(trip);

        return tripDTO;
    }
}
