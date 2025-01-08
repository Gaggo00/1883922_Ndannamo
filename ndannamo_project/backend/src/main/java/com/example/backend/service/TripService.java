package com.example.backend.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import com.example.backend.mapper.ExpenseMapperImpl;
import com.example.backend.mapper.TripMapperImpl;
import com.example.backend.repositories.TripRepository;
import com.example.backend.utils.TripValidation;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Activity;
import com.example.backend.model.Event;
import com.example.backend.model.Expense;
import com.example.backend.model.Night;
import com.example.backend.model.Travel;
import com.example.backend.model.Trip;
import com.example.backend.model.User;
import com.example.backend.dto.ActivityCreationRequest;
import com.example.backend.dto.AmountUserDTO;
import com.example.backend.dto.EventDTO;
import com.example.backend.dto.ExpenseCreationRequest;
import com.example.backend.dto.ExpenseDTO;
import com.example.backend.dto.TravelCreationRequest;
import com.example.backend.dto.TripCreationRequest;
import com.example.backend.dto.TripDTO;

@Service
public class TripService {
    
    private final TripRepository tripRepository;

    private final UserService userService;
    private final EventService eventService;
    private final ExpenseService expenseService;

    private final TripMapperImpl tripMapper;
    private final ExpenseMapperImpl expenseMapper;

    @Autowired
    public TripService(TripRepository tripRepository, UserService userService, EventService eventService, ExpenseService expenseService,
                       TripMapperImpl tripMapper, ExpenseMapperImpl expenseMapper) {
        this.tripRepository = tripRepository;
        this.expenseService = expenseService;
        this.userService = userService;
        this.eventService = eventService;
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

        // Crea schedule
        int tripDays = (int) tripRequest.getStartDate().until(tripRequest.getEndDate(), java.time.temporal.ChronoUnit.DAYS);  // durata trip in giorni (escluso l'ultimo)
        List<Event> schedule = new ArrayList<Event>();

        // La trip va salvata ora se no la creazione delle night da' errore
        tripRepository.save(trip);

        // Crea una notte per ogni giorno tranne l'ultimo
        for (var i = 0; i < tripDays; i++) {
            Night night = eventService.createNight(trip, tripRequest.getStartDate().plusDays(i), tripRequest.getLocations().get(0), null);
            schedule.add(night);
        }

        trip.setSchedule(schedule);

        // Ri-salva la trip con la schedule aggiornata
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

        // Controllo che l'utente loggato faccia parte della trip
        User logged_user = userService.getUserByEmail(email);
        if (!userIsAParticipant(logged_user, trip)) {
            throw new ResourceNotFoundException("Trip not found");
        }

        // Converti Trip in TripDTO
        TripDTO tripDTO = tripMapper.toDTO(trip);

        // se l'utente loggato e' il creatore
        if (userIsTheCreator(logged_user, trip)) {
            tripDTO.setCreator(true);
        }

        return tripDTO;
    }

    public String inviteToTrip(String email, long tripId, List<String> inviteList) {

        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato sia il creatore della trip
        if (!userIsTheCreator(email, trip)) {
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
        if (!userIsTheCreator(email, trip)) {
            throw new ResourceNotFoundException("Only the trip creator can delete this trip");
        }

        // Elimina la schedule della trip
        eventService.deleteSchedule(trip.getSchedule());

        tripRepository.delete(trip);
    }


    // Per lasciare una trip (solo se NON sei il creatore)
    public void leaveTrip(String email, long tripId) {
        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato NON sia il creatore della trip
        User logged_user = userService.getUserByEmail(email);
        if (userIsTheCreator(logged_user, trip)) {
            throw new ResourceNotFoundException("As the trip creator, you can't leave this trip");
        }
        // Controllo che l'utente loggato faccia parte della trip
        else if (!userIsAParticipant(logged_user, trip)) {
            throw new ResourceNotFoundException("Trip not found");
        }

        trip.getParticipants().remove(logged_user);

        // Aggiorno il database
        tripRepository.save(trip);
    }



    /********************** FUNZIONI PER LA SCHEDULE **********************/


    // Ottieni l'intera schedule
    public List<EventDTO> getSchedule(String email, long tripId) {
        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato faccia parte della trip
        if (!userIsAParticipant(email, trip)) {
            throw new ResourceNotFoundException("Trip not found");
        }

        // Prendo la schedule della trip
        List<Event> schedule = trip.getSchedule();

        // Converto la lista di Event in lista di EventDTO
        List<EventDTO> scheduleDTO = new ArrayList<EventDTO>();
        
        for (Event event: schedule) {
            if (event.getClass() == Night.class) {
                scheduleDTO.add(eventService.nightToEventDTO((Night) event));
            }
            else if (event.getClass() == Activity.class) {
                scheduleDTO.add(eventService.activityToEventDTO((Activity) event));
            }
            else if (event.getClass() == Travel.class) {
                scheduleDTO.add(eventService.travelToEventDTO((Travel) event));
            }
        }

        return scheduleDTO;
    }

    // Crea una nuova activity
    public String createActivity(String email, long tripId, ActivityCreationRequest activityCreationRequest) {
        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato faccia parte della trip
        if (!userIsAParticipant(email, trip)) {
            throw new ResourceNotFoundException("Trip not found");
        }

        // Creo l'activity
        Activity activity = eventService.createActivity(trip, activityCreationRequest);

        // Aggiungo l'activity alla schedule
        List<Event> schedule = trip.getSchedule();
        schedule.add(activity);
        trip.setSchedule(schedule);

        // Salvo la trip
        tripRepository.save(trip);

        return ("Activity created");
    }

    // Elimina una activity
    public String deleteActivity(String email, long tripId, long activityId) {
        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato faccia parte della trip
        if (!userIsAParticipant(email, trip)) {
            throw new ResourceNotFoundException("Trip not found");
        }

        // Elimina activity
        eventService.deleteActivity(trip, activityId);

        // Aggiorno la trip
        tripRepository.save(trip);

        return ("Activity removed");
    }

    // Crea un nuovo travel
    public String createTravel(String email, long tripId, TravelCreationRequest travelCreationRequest) {
        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato faccia parte della trip
        if (!userIsAParticipant(email, trip)) {
            throw new ResourceNotFoundException("Trip not found");
        }

        // Creo il travel
        Travel travel = eventService.createTravel(trip, travelCreationRequest);

        // Aggiungo il travel alla schedule
        List<Event> schedule = trip.getSchedule();
        schedule.add(travel);
        trip.setSchedule(schedule);

        // Salvo la trip
        tripRepository.save(trip);

        return ("Travel created");
    }

    // Elimina un travel
    public String deleteTravel(String email, long tripId, long travelId) {
        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato faccia parte della trip
        if (!userIsAParticipant(email, trip)) {
            throw new ResourceNotFoundException("Trip not found");
        }

        // Elimina il travel
        eventService.deleteTravel(trip, travelId);

        // Aggiorno la trip
        tripRepository.save(trip);

        return ("Travel removed");
    }



    /********************** FUNZIONI PER LE SPESE **********************/


    // Per ottenere tutte le spese di una trip
    public List<ExpenseDTO> getExpenses(String email, long tripId) {
        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato faccia parte della trip
        if (!userIsAParticipant(email, trip)) {
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
        if (!userIsAParticipant(email, trip)) {
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
        if (!userIsAParticipant(expenseCreationRequest.getPaidById(), trip)) {
            throw new ResourceNotFoundException("User 'paid by' not found!");
        }
        expense.setPaidBy(expenseCreationRequest.getPaidById());

        // Per controllare che la somma degli amount di tutti gli utenti sia uguale all'amount totale
        double tot = 0;

        // Controllo che tutti gli utenti nella lista amountPerUser facciano parte della trip
        List<AmountUserDTO> amountPerUserDTO = expenseCreationRequest.getAmountPerUser();
        Map<Long, Double> amountPerUserMap = new HashMap<Long, Double>();
        for (AmountUserDTO amountUser : amountPerUserDTO) {
            // Controllo che l'utente faccia parte della trip
            if (!userIsAParticipant(amountUser.getUser(), trip)) {
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

        return("Expense created");
    }


    // Per eliminare una spesa
    public boolean deleteExpense(String email, long tripId, long expenseId) {

        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato faccia parte della trip
        if (!userIsAParticipant(email, trip)) {
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




    /********************** FUNZIONI PER CAMBIARE I DATI DI UNA TRIP **********************/


    public void changeTitle(String email, long tripId, String newTitle) {

        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato faccia parte della trip
        if (!userIsAParticipant(email, trip)) {
            throw new ResourceNotFoundException("Trip not found");
        }

        // Controllo validita' titolo
        String titleStripped = newTitle.strip();
        if (!TripValidation.titleValid(titleStripped)) {
            throw new ResourceNotFoundException("Title not valid");
        }

        // Aggiorna titolo
        trip.setTitle(newTitle);

        // Salva trip
        tripRepository.save(trip);
    }

    public void changeDates(String email, long tripId, LocalDate newStartDate, LocalDate newEndDate) {
        
        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato faccia parte della trip
        if (!userIsAParticipant(email, trip)) {
            throw new ResourceNotFoundException("Trip not found");
        }

        // Controllo validita' date
        if (!TripValidation.datesValid(newStartDate, newEndDate)) {
            throw new ResourceNotFoundException("Dates not valid");
        }

        // TODO:
        // Shiftare le date degli eventi in modo che rientrino tra le nuove date (se la data iniziale e' cambiata),
        // eliminare eventi che cadono al di fuori delle nuove date (se ora la durata e' minore),
        // o creare nuove notti per coprire i giorni extra (se ora la durata e' maggiore)

        // Aggiorna date
        trip.setStartDate(newStartDate);
        trip.setEndDate(newEndDate);

        // Salva trip
        tripRepository.save(trip);
    }

    public void changeLocations(String email, long tripId, List<String> newLocations) {
        
        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato faccia parte della trip
        if (!userIsAParticipant(email, trip)) {
            throw new ResourceNotFoundException("Trip not found");
        }

        // Aggiorna localita'
        trip.setLocations(newLocations);

        // Salva trip
        tripRepository.save(trip);
    }






    /********************** FUNZIONI PER CAMBIARE I DATI DEGLI EVENTI **********************/

    // Cambia info activity
    public void changeActivityInfo(String email, long tripId, long activityId, String newInfo) {
        Trip trip = getTripById(tripId);

        // Controllo che l'utente loggato faccia parte della trip
        if (!userIsAParticipant(email, trip)) {
            throw new ResourceNotFoundException("Trip not found");
        }

        // Cambio le info
        eventService.changeActivityInfo(trip, activityId, newInfo);
    }




    /****************** FUNZIONI PER CONTROLLARE I PERMESSI DEGLI UTENTI ******************/

    private boolean userIsAParticipant(User user, Trip trip) {
        return trip.getParticipants().contains(user);
    }

    private boolean userIsAParticipant(String email, Trip trip) {
        User user = userService.getUserByEmail(email);
        return trip.getParticipants().contains(user);
    }

    private boolean userIsAParticipant(Long userId, Trip trip) {
        User user = userService.getUserById(userId);
        return trip.getParticipants().contains(user);
    }

    private boolean userIsAParticipant(String email, Long tripId) {
        User user = userService.getUserByEmail(email);
        Trip trip = getTripById(tripId);
        return trip.getParticipants().contains(user);
    }

    private boolean userIsTheCreator(User user, Trip trip) {
        return trip.getCreated_by() == user;
    }

    private boolean userIsTheCreator(String email, Trip trip) {
        User user = userService.getUserByEmail(email);
        return trip.getCreated_by() == user;
    }

    private boolean userIsTheCreator(String email, Long tripId) {
        User user = userService.getUserByEmail(email);
        Trip trip = getTripById(tripId);
        return trip.getCreated_by() == user;
    }

}


