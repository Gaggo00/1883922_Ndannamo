package com.example.backend.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.function.Function;

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
import com.example.backend.model.Event.EventType;
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

        // Elimina l'activity
        activityRepository.delete(activity);

        return true;
    }


    // Cambia nome activity
    public void changeActivityName(Trip trip, long activityId, String newName) {
        // Trova l'activity
        Activity activity = getActivityById(activityId);

        // Controlla che l'activity faccia parte della trip
        if (activity.getTrip() != trip) {
            throw new ResourceNotFoundException("Activity not found!");
        }

        // Cambia valore
        activity.setName(newName);

        // Aggiorna l'activity
        activityRepository.save(activity);
    }

    // Cambia posto activity
    public void changeActivityPlace(Trip trip, long activityId, String newPlace) {
        changeEventPlace(EventType.ACTIVITY, trip, activityId, newPlace);
    }

    // Cambia data activity
    public void changeActivityDate(Trip trip, long activityId, LocalDate newDate) {
        changeEventDate(EventType.ACTIVITY, trip, activityId, newDate);
    }

    // Cambia orario activity
    public void changeActivityTime(Trip trip, long activityId, LocalTime newStartTime, LocalTime newEndTime) {
        // Trova l'activity
        Activity activity = getActivityById(activityId);

        // Controlla che l'activity faccia parte della trip
        if (activity.getTrip() != trip) {
            throw new ResourceNotFoundException("Activity not found!");
        }

        // Cambia valore
        activity.setStartTime(newStartTime);
        activity.setEndTime(newEndTime);

        // Aggiorna l'activity
        activityRepository.save(activity);
    }

    // Cambia indirizzo activity
    public void changeActivityAddress(Trip trip, long activityId, String newAddress) {
        // Trova l'activity
        Activity activity = getActivityById(activityId);

        // Controlla che l'activity faccia parte della trip
        if (activity.getTrip() != trip) {
            throw new ResourceNotFoundException("Activity not found!");
        }

        // Cambia valore
        activity.setAddress(newAddress);

        // Aggiorna l'activity
        activityRepository.save(activity);
    }

    // Cambia info activity
    public void changeActivityInfo(Trip trip, long activityId, String newInfo) {
        // Trova l'activity
        Activity activity = getActivityById(activityId);

        // Controlla che l'activity faccia parte della trip
        if (activity.getTrip() != trip) {
            throw new ResourceNotFoundException("Activity not found!");
        }

        // Cambia valore
        activity.setInfo(newInfo);

        // Aggiorna l'activity
        activityRepository.save(activity);
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

        // Elimina il travel
        travelRepository.delete(travel);

        return true;
    }


    // Cambia posto travel
    public void changeTravelPlace(Trip trip, long travelId, String newPlace) {
        changeEventPlace(EventType.TRAVEL, trip, travelId, newPlace);
    }

    // Cambia data travel
    public void changeTravelDate(Trip trip, long travelId, LocalDate newDate) {
        changeEventDate(EventType.TRAVEL, trip, travelId, newDate);
    }

    // Cambia info travel
    public void changeTravelInfo(Trip trip, long travelId, String newInfo) {
        // Trova travel
        Travel travel = getTravelById(travelId);

        // Controlla che l'activity faccia parte della trip
        if (travel.getTrip() != trip) {
            throw new ResourceNotFoundException("Travel not found!");
        }

        // Cambia info
        travel.setInfo(newInfo);

        // Aggiorna travel
        travelRepository.save(travel);
    }



    /*************** NIGHT ***************/

    // Cambia posto night
    public void changeNightPlace(Trip trip, long nightId, String newPlace) {
        changeEventPlace(EventType.NIGHT, trip, nightId, newPlace);
    }

    // Cambia data night
    public void changeNightDate(Trip trip, long nightId, LocalDate newDate) {
        changeEventDate(EventType.NIGHT, trip, nightId, newDate);
    }



    

    /*************** Per modificare i campi in comune a tutti e tre gli eventi ***************/

    // Cambia posto evento
    private void changeEventPlace(EventType eventType, Trip trip, long eventId, String newPlace) {
        
        // Trova l'evento
        Event event;
        switch(eventType) {
            case ACTIVITY:
                event = getActivityById(eventId);
                break;
            case TRAVEL:
                event = getTravelById(eventId);
                break;
            case NIGHT:
                event = getNightById(eventId);
                break;
            default:
                throw new ResourceNotFoundException("Event not found!");
        }

        // Controlla che l'evento faccia parte della trip
        if (event.getTrip() != trip) {
            throw new ResourceNotFoundException("Event not found!");
        }

        // Cambia valore
        event.setPlace(newPlace);

        // Aggiorna l'evento
        switch(eventType) {
            case ACTIVITY:
                activityRepository.save((Activity) event);
                break;
            case TRAVEL:
                travelRepository.save((Travel) event);
                break;
            case NIGHT:
                nightRepository.save((Night) event);
                break;
            default:
                throw new ResourceNotFoundException("Event not found!");
        }
    }


    // Cambia data evento
    private void changeEventDate(EventType eventType, Trip trip, long eventId, LocalDate newDate) {
        
        // Trova l'evento
        Event event;
        switch(eventType) {
            case ACTIVITY:
                event = getActivityById(eventId);
                break;
            case TRAVEL:
                event = getTravelById(eventId);
                break;
            case NIGHT:
                event = getNightById(eventId);
                break;
            default:
                throw new ResourceNotFoundException("Event not found!");
        }

        // Controlla che l'evento faccia parte della trip
        if (event.getTrip() != trip) {
            throw new ResourceNotFoundException("Event not found!");
        }

        // Cambia valore
        event.setDate(newDate);

        // Aggiorna l'evento
        switch(eventType) {
            case ACTIVITY:
                activityRepository.save((Activity) event);
                break;
            case TRAVEL:
                travelRepository.save((Travel) event);
                break;
            case NIGHT:
                nightRepository.save((Night) event);
                break;
            default:
                throw new ResourceNotFoundException("Event not found!");
        }
    }
}
