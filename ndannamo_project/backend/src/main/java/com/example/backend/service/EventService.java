package com.example.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.dto.ActivityCreationRequest;
import com.example.backend.dto.EventDTO;
import com.example.backend.dto.TravelCreationRequest;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.ActivityMapperImpl;
import com.example.backend.mapper.NightMapperImpl;
import com.example.backend.mapper.TravelMapperImpl;
import com.example.backend.model.Activity;
import com.example.backend.model.Event;
import com.example.backend.model.Night;
import com.example.backend.model.OvernightStay;
import com.example.backend.model.Travel;
import com.example.backend.model.Trip;
import com.example.backend.repositories.ActivityRepository;
import com.example.backend.repositories.NightRepository;
import com.example.backend.repositories.TravelRepository;


@Service
public class EventService {
    
    private final NightRepository nightRepository;
    private final ActivityRepository activityRepository;
    private final TravelRepository travelRepository;
    private final NightMapperImpl nightMapper;
    private final ActivityMapperImpl activityMapper;
    private final TravelMapperImpl travelMapper;


    @Autowired
    public EventService(NightRepository nightRepository, ActivityRepository activityRepository, TravelRepository travelRepository,
                        NightMapperImpl nightMapper, ActivityMapperImpl activityMapper, TravelMapperImpl travelMapper) {
        this.nightRepository = nightRepository;
        this.activityRepository = activityRepository;
        this.travelRepository = travelRepository;
        this.nightMapper = nightMapper;
        this.activityMapper = activityMapper;
        this.travelMapper = travelMapper;
    }


    /*************** GET ***************/

    public Activity getActivityById(long id) {
        return activityRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Activity not found!"));
    }
    public Night getNightById(long id) {
        return nightRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Night not found!"));
    }
    public Travel getTravelById(long id) {
        return travelRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Travel not found!"));
    }


    /*************** DTO ***************/

    public EventDTO activityToEventDTO(Activity activity) {
        return activityMapper.toDTO(activity);
    }
    public EventDTO nightToEventDTO(Night night) {
        return nightMapper.toDTO(night);
    }
    public EventDTO travelToEventDTO(Travel travel) {
        return travelMapper.toDTO(travel);
    }


    /*************** Per eliminare tutta la schedule ***************/

    public void deleteSchedule(List<Event> schedule) {
        for (Event event: schedule) {
            if (event.getClass() == Night.class) {
                nightRepository.delete((Night) event);
            }
            else if (event.getClass() == Activity.class) {
                activityRepository.delete((Activity) event);
            }
            else if (event.getClass() == Travel.class) {
                travelRepository.delete((Travel) event);
            }
        }
    }


    /*************** NIGHT ***************/

    // Crea una nuova night
    public Night createNight(Trip trip, LocalDate date, String place, OvernightStay overnightStay) {
        Night night = new Night();
        night.setDate(date);
        night.setPlace(place);
        night.setOvernightStay(overnightStay);
        night.setTrip(trip);
        return nightRepository.save(night);
    }


    /*************** ACTIVITY ***************/

    // Crea una nuova activity
    public Activity createActivity(Trip trip, ActivityCreationRequest activityCreationRequest) {

        // Creo l'activity
        Activity activity = new Activity();
        activity.setPlace(activityCreationRequest.getPlace());
        activity.setName(activityCreationRequest.getName());
        activity.setDate(activityCreationRequest.getDate());
        activity.setStartTime(activityCreationRequest.getStartTime());
        activity.setEndTime(activityCreationRequest.getEndTime());
        activity.setAddress(activityCreationRequest.getAddress());
        activity.setInfo(activityCreationRequest.getInfo());
        activity.setTrip(trip);

        // Salvo l'activity
        return activityRepository.save(activity);
    }

    // Elimina una activity
    public boolean deleteActivity(Trip trip, long activityId) {
        
        // Trova l'activity
        Activity activity = getActivityById(activityId);

        // Controlla che l'activity faccia parte della trip
        if (activity.getTrip() != trip) {
            throw new ResourceNotFoundException("Activity not found!");
        }

        // Rimuovi l'activity dalla schedule
        List<Event> schedule = trip.getSchedule();
        schedule.remove(activity);
        trip.setSchedule(schedule);

        // Elimina l'activity
        activityRepository.delete(activity);

        return true;
    }



    /*************** TRAVEL ***************/

    // Crea un nuovo travel
    public Travel createTravel(Trip trip, TravelCreationRequest travelCreationRequest) {
        
        // Crea travel
        Travel travel = new Travel();
        travel.setPlace(travelCreationRequest.getPlace());
        travel.setAddress(travelCreationRequest.getAddress());
        travel.setDestination(travelCreationRequest.getDestination());
        travel.setDate(travelCreationRequest.getDate());
        travel.setArrivalDate(travelCreationRequest.getArrivalDate());
        travel.setDepartureTime(travelCreationRequest.getDepartureTime());
        travel.setArrivalTime(travelCreationRequest.getArrivalTime());
        travel.setInfo(travelCreationRequest.getInfo());
        travel.setTrip(trip);

        // Salva travel
        return travelRepository.save(travel);
    }

    // Elimina un travel
    public boolean deleteTravel(Trip trip, long travelId) {
    
        // Trova travel
        Travel travel = getTravelById(travelId);

        // Controlla che il travel faccia parte della trip
        if (travel.getTrip() != trip) {
            throw new ResourceNotFoundException("Travel not found!");
        }

        // Rimuovi il travel dalla schedule
        List<Event> schedule = trip.getSchedule();
        schedule.remove(travel);
        trip.setSchedule(schedule);

        // Elimina il travel
        travelRepository.delete(travel);

        return true;
    }

}
