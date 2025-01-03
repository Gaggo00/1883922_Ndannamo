package com.example.backend.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.backend.mapper.ExpenseMapperImpl;
import com.example.backend.mapper.TripMapperImpl;
import com.example.backend.repositories.ExpenseRepository;
import com.example.backend.repositories.TripRepository;
import com.example.backend.repositories.UserRepository;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Expense;
import com.example.backend.model.Trip;
import com.example.backend.model.User;
import com.example.backend.dto.AmountUserDTO;
import com.example.backend.dto.ExpenseCreationRequest;
import com.example.backend.dto.ExpenseDTO;
import com.example.backend.dto.TripCreationRequest;
import com.example.backend.dto.TripDTO;

@Service
public class TripService {
    
    private final TripRepository tripRepository;
    private final ExpenseService expenseService;
    private final UserService userService;
    private final TripMapperImpl tripMapper;
    private final ExpenseMapperImpl expenseMapper;

    @Autowired
    public TripService(TripRepository tripRepository, ExpenseService expenseService, UserService userService,
                       TripMapperImpl tripMapper, ExpenseMapperImpl expenseMapper) {
        this.tripRepository = tripRepository;
        this.expenseService = expenseService;
        this.userService = userService;
        this.tripMapper = tripMapper;
        this.expenseMapper = expenseMapper;
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


    // Per eliminare una trip (solo se sei il creatore)
    public void deleteTrip(String email, long tripId) {
        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato sia il creatore della trip
        User logged_user = userService.getUserByEmail(email);
        if (trip.getCreated_by() != logged_user) {
            throw new ResourceNotFoundException("Only the trip creator can delete this trip");
        }
        tripRepository.delete(trip);
    }


    // Per lasciare una trip (solo se NON sei il creatore)
    public void leaveTrip(String email, long tripId) {
        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato NON sia il creatore della trip
        User logged_user = userService.getUserByEmail(email);
        if (trip.getCreated_by() == logged_user) {
            throw new ResourceNotFoundException("As the trip creator, you can't leave this trip");
        }
        // Controllo che l'utente loggato faccia parte della trip
        else if (!trip.getParticipants().contains(logged_user)) {
            throw new ResourceNotFoundException("Trip not found");
        }

        trip.getParticipants().remove(logged_user);

        // Aggiorno il database
        tripRepository.save(trip);
    }



    // Per ottenere tutte le spese di una trip
    public List<ExpenseDTO> getExpenses(String email, long tripId) {
        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato faccia parte della trip
        User logged_user = userService.getUserByEmail(email);
        if (!trip.getParticipants().contains(logged_user)) {
            throw new ResourceNotFoundException("Trip not found");
        }

        // Prendo la lista di spese della trip
        List<Expense> expenses = trip.getExpenses();

        // Converto la lista di Expense in lista di ExpenseDTO
        List<ExpenseDTO> expensesDTO = expenses.stream()
            .map(expense -> expenseMapper.toDTO(expense))
            .collect(Collectors.toList());

        return expensesDTO;
    }


    // Per aggiungere una nuova spesa alla trip
    public String createExpense(String email, long tripId, ExpenseCreationRequest expenseCreationRequest) {

        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato faccia parte della trip
        User logged_user = userService.getUserByEmail(email);
        if (!trip.getParticipants().contains(logged_user)) {
            throw new ResourceNotFoundException("Trip not found");
        }

        // Creo la spesa
        Expense expense = new Expense();

        // Salvo i campi semplici
        expense.setTrip(trip);
        expense.setTitle(expenseCreationRequest.getTitle());
        expense.setDate(expenseCreationRequest.getDate());
        expense.setAmount(expenseCreationRequest.getAmount());
        expense.setSplitEven(expenseCreationRequest.getSplitEven());

        // Controllo che l'utente pagante faccia parte della trip
        User paidBy = userService.getUserById(expenseCreationRequest.getPaidById());
        if (!trip.getParticipants().contains(paidBy)) {
            throw new ResourceNotFoundException("User 'paid by' not found!");
        }
        expense.setPaidBy(expenseCreationRequest.getPaidById());


        // Per controllare che la somma degli amount di tutti gli utenti sia uguale all'amount totale
        double tot = 0;

        // Controllo che tutti gli utenti nella lista amountPerUser facciano parte della trip
        List<AmountUserDTO> amountPerUserDTO = expenseCreationRequest.getAmountPerUser();
        Map<Long, Double> amountPerUserMap = new HashMap<Long, Double>();
        for (AmountUserDTO amountUser : amountPerUserDTO) {
            User user = userService.getUserById(amountUser.getUser());
            if (!trip.getParticipants().contains(user)) {
                throw new ResourceNotFoundException("User not found!");
            }
            tot += amountUser.getAmount();
            amountPerUserMap.put(amountUser.getUser(), amountUser.getAmount());
        }
        if (expenseCreationRequest.getAmount() != tot) {
            throw new ResourceNotFoundException("Expense division is incorrect");
        }
        
        // Salvo la lista amountPerUser
        expense.setAmountPerUser(amountPerUserMap);

        // Salvo la spesa
        expenseService.saveExpense(expense);

        // Aggiungo la spesa alla trip
        List<Expense> tripExpenses = trip.getExpenses();
        tripExpenses.add(expense);
        trip.setExpenses(tripExpenses);

        // Salvo la trip
        tripRepository.save(trip);

        return("okkk");
    }


    // Per eliminare una spesa
    public boolean deleteExpense(String email, long tripId, long expenseId) {

        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato faccia parte della trip
        User logged_user = userService.getUserByEmail(email);
        if (!trip.getParticipants().contains(logged_user)) {
            throw new ResourceNotFoundException("Trip not found");
        }

        // Controllo che la spesa sia una spesa della trip
        Expense expense = expenseService.getExpenseById(expenseId);
        if (expense.getTrip() != trip) {
            throw new ResourceNotFoundException("Expense not found");
        }

        // Rimuovi la spesa dalla lista di spese della trip (va fatto se no l'eliminazione va in errore)
        List<Expense> tripExpenses = trip.getExpenses();
        tripExpenses.remove(expense);
        trip.setExpenses(tripExpenses);

        // Salva trip
        tripRepository.save(trip);

        // Elimina spesa
        expenseService.deleteExpense(expense);

        return true;
    }

}


