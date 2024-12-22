package com.example.backend.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    
    public Trip getTripById(long id) {
        return tripRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Trip not found!"));
    }

    public Trip createTrip(String email, TripCreationRequest tripRequest) {
        // Ottieni user dall'username
        User logged_user = userService.getUserByEmail(email);

        Trip trip = new Trip();

        trip.setTitle(tripRequest.getTitle());
        trip.setLocations(tripRequest.getLocations());
        trip.setCreationDate(LocalDate.now());
        trip.setStartDate(tripRequest.getStartDate());
        trip.setEndDate(tripRequest.getEndDate());

        trip.setCreated_by(logged_user);

        ArrayList<User> participants = new ArrayList<User>();
        participants.add(logged_user);

        trip.setParticipants(participants);

        return tripRepository.save(trip);
    }
    

    public List<TripDTO> getTripsOfUser(String email) {

        // Ottengo l'utente loggato
        User logged_user = userService.getUserByEmail(email);

        // Prendo le trip dell'utente loggato
        List<Trip> trips = logged_user.getTrips();

        // Converto la lista di Trip in lista di TripDTO
        List<TripDTO> tripsDTO = trips.stream()
            .map(trip -> tripMapper.toDTO(trip))
            .collect(Collectors.toList());

        return tripsDTO;
    }


    public TripDTO getTripDTOById(String email, long id) {

        Trip trip = getTripById(id);

        // Controllo che l'utente loggato sia un participant della trip
        User logged_user = userService.getUserByEmail(email);
        if (!trip.getParticipants().contains(logged_user)) {
            throw new ResourceNotFoundException("Trip not found!");
        }

        // Converti Trip in TripDTO
        TripDTO tripDTO = tripMapper.toDTO(trip);

        return tripDTO;
    }

    public String inviteToTrip(String email, long tripId, List<String> inviteList) {

        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato sia il creatore della trip
        User logged_user = userService.getUserByEmail(email);
        if (trip.getCreated_by() != logged_user) {
            throw new ResourceNotFoundException("You can't send invitations for this trip");
        }

        // Crea inviti
        for (String invitedEmail: inviteList) {
            try {
                User invitedUser = userService.getUserByEmail(invitedEmail);
                boolean res = invitedUser.addInvitation(trip);
                userService.saveUser(invitedUser);
                return "" + res;

                // qua dovremmo mandare per email una notifica tipo "accetta l'invito", ma non lo facciamo
                // ...
            }
            catch (UsernameNotFoundException ex) {
                // qua dovremmo mandare per email l'invito ad iscriversi al sito, ma non lo facciamo
                // ...
                continue;
            }
        }
        return "invite list is empty";
    }

    
    // Per accettare o rifiutare un invito ad una trip
    public void manageInvitation(String email, long tripId, boolean acceptInvitation) {

        User user = userService.getUserByEmail(email);

        Trip trip = getTripById(tripId);

        // Controlla se l'utente e' stato invitato a quella trip
        if (user.getInvitations().contains(trip)) {
            user.manageInvitation(trip, acceptInvitation);
            userService.saveUser(user);
        }
        else {
            throw new ResourceNotFoundException("Invitation not found");
        }
    }


    public void deleteTrip(String email, long tripId) {
        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato sia il creatore della trip
        User logged_user = userService.getUserByEmail(email);
        if (trip.getCreated_by() != logged_user) {
            throw new ResourceNotFoundException("Only the trip creator can delete this trip");
        }
        tripRepository.delete(trip);
    }
}
