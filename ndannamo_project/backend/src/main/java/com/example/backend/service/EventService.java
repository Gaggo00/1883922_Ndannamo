package com.example.backend.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import com.example.backend.dto.*;
import com.example.backend.model.*;
import com.example.backend.repositories.*;
import com.example.backend.utils.EventType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.ActivityMapperImpl;
import com.example.backend.mapper.NightMapperImpl;
import com.example.backend.mapper.TravelMapperImpl;
import com.example.backend.mapper.AttachmentMapperImpl;
import com.example.backend.repositories.ActivityRepository;
import com.example.backend.repositories.NightRepository;
import com.example.backend.repositories.OvernightStayRepository;
import com.example.backend.repositories.TravelRepository;


@Service
public class EventService {
    
    private final NightRepository nightRepository;
    private final ActivityRepository activityRepository;
    private final TravelRepository travelRepository;
    private final EventRepository eventRepository;
    private final AttachmentRepository attachmentRepository;
    private final OvernightStayRepository overnightStayRepository;
    private final NightMapperImpl nightMapper;
    private final ActivityMapperImpl activityMapper;
    private final TravelMapperImpl travelMapper;
    private final AttachmentMapperImpl attachmentMapper;
    private final CityRepository cityRepository;


    @Autowired
    public EventService(NightRepository nightRepository, ActivityRepository activityRepository, TravelRepository travelRepository, AttachmentRepository attachmentRepository,
                        NightMapperImpl nightMapper, ActivityMapperImpl activityMapper, TravelMapperImpl travelMapper,
                        EventRepository eventRepository, AttachmentMapperImpl attachmentMapper,
                        OvernightStayRepository overnightStayRepository, CityRepository cityRepository) {
        this.nightRepository = nightRepository;
        this.activityRepository = activityRepository;
        this.travelRepository = travelRepository;
        this.overnightStayRepository = overnightStayRepository;
        this.attachmentRepository = attachmentRepository;
        this.nightMapper = nightMapper;
        this.activityMapper = activityMapper;
        this.travelMapper = travelMapper;
        this.eventRepository = eventRepository;
        this.attachmentMapper = attachmentMapper;
        this.cityRepository = cityRepository;
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
    public OvernightStay getOvernightStayById(long id) {
        return overnightStayRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("OvernightStay not found!"));
    }


    /*************** SAVE ***************/

    public Night saveNight(Night night) {
        return nightRepository.save(night);
    }
    public List<AttachmentSimpleDTO> getAttachments(long id) {
        return attachmentRepository.findByEventId(id).stream().map(this::attachmentToAttachmentSimpleDTO).toList();
    }




    /*************** DTO ***************/

    public ActivityDTO activityToDTO(Activity activity) {
        return activityMapper.toDTO(activity);
    }
    public NightDTO nightToDTO(Night night) {
        return nightMapper.toDTO(night);
    }
    public TravelDTO travelToDTO(Travel travel) {
        return travelMapper.toDTO(travel);
    }
    public AttachmentSimpleDTO attachmentToAttachmentSimpleDTO(Attachment attachment) {
        return attachmentMapper.toSimpleDTO(attachment);
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
        final String[] cityInfo = place.split(",");
        final City city =  cityRepository.findFirstByNameAndCountryIgnoreCase(cityInfo[0].strip(), cityInfo[1].strip()).get(); // FIXME: unsafe call to find
        Night night = Night.builder()
                .date(date)
                .place(city)
                .placeName(city.getName() + ", " + city.getCountry())
                .overnightStay(overnightStay)
                .trip(trip)
                .build();
        return nightRepository.save(night);
    }


    /*************** ACTIVITY ***************/

    // Crea una nuova activity
    public Activity createActivity(Trip trip, ActivityCreationRequest activityCreationRequest) {
        final String[] cityInfo = activityCreationRequest.getPlace().split(",");
        final City city = cityRepository.findFirstByNameAndCountryIgnoreCase(cityInfo[0].strip(), cityInfo[1].strip()).get(); // FIXME: unsafe call to find
        // Creo l'activity
        Activity activity = Activity.builder()
                .place(city)
                .placeName(city.getName() + ", " + city.getCountry())
                .name(activityCreationRequest.getName())
                .date(activityCreationRequest.getDate())
                .startTime(activityCreationRequest.getStartTime())
                .endTime(activityCreationRequest.getEndTime())
                .address(activityCreationRequest.getAddress())
                .info(activityCreationRequest.getInfo())
                .trip(trip)
                .build();

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
        final String[] cityInfo = travelCreationRequest.getPlace().split(",");
        final City city = cityRepository.findFirstByNameAndCountryIgnoreCase(cityInfo[0].strip(), cityInfo[1].strip()).get(); // FIXME: unsafe call to find
        // Crea travel
        Travel travel = Travel.builder()
                .place(city)
                .placeName(city.getName() + ", " + city.getCountry())
                .address(travelCreationRequest.getAddress())
                .destination(travelCreationRequest.getDestination())
                .date(travelCreationRequest.getDate())
                .arrivalDate(travelCreationRequest.getArrivalDate())
                .departureTime(travelCreationRequest.getDepartureTime())
                .arrivalTime(travelCreationRequest.getArrivalTime())
                .info(travelCreationRequest.getInfo())
                .trip(trip)
                .build();

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

    // Cambia destinazione travel
    public void changeTravelDestination(Trip trip, long travelId, String newDestination) {
        // Trova travel
        Travel travel = getTravelById(travelId);

        // Controlla che il travel faccia parte della trip
        if (travel.getTrip() != trip) {
            throw new ResourceNotFoundException("Travel not found!");
        }

        // Cambia valore
        travel.setDestination(newDestination);

        // Aggiorna l'activity
        travelRepository.save(travel);
    }

    // Cambia data partenza travel
    public void changeTravelDate(Trip trip, long travelId, LocalDate newDate) {
        changeEventDate(EventType.TRAVEL, trip, travelId, newDate);
    }

    // Cambia data arrivo travel
    public void changeTravelArrivalDate(Trip trip, long travelId, LocalDate newArrivalDate) {
        // Trova travel
        Travel travel = getTravelById(travelId);

        // Controlla che l'activity faccia parte della trip
        if (travel.getTrip() != trip) {
            throw new ResourceNotFoundException("Travel not found!");
        }

        // Controlla che la data di arrivo non sia prima di quella di partenza
        if (travel.getDate().isAfter(newArrivalDate)) {
            throw new ResourceNotFoundException("Arrival date can't be before departure date!");
        }

        // Cambia info
        travel.setArrivalDate(newArrivalDate);

        // Aggiorna travel
        travelRepository.save(travel);
    }

    // Cambia indirizzo travel
    public void changeTravelAddress(Trip trip, long travelId, String newAddress) {
        // Trova travel
        Travel travel = getTravelById(travelId);

        // Controlla che il travel faccia parte della trip
        if (travel.getTrip() != trip) {
            throw new ResourceNotFoundException("Travel not found!");
        }

        // Cambia valore
        travel.setAddress(newAddress);

        // Aggiorna travel
        travelRepository.save(travel);
    }

    // Cambia orario travel
    public void changeTravelTime(Trip trip, long travelId, LocalTime newStartTime, LocalTime newEndTime) {
        // Trova travel
        Travel travel = getTravelById(travelId);

        // Controlla che il travel faccia parte della trip
        if (travel.getTrip() != trip) {
            throw new ResourceNotFoundException("Travel not found!");
        }

        // Cambia valore
        travel.setDepartureTime(newStartTime);
        travel.setArrivalTime(newEndTime);

        // Aggiorna travel
        travelRepository.save(travel);
    }

    // Cambia info travel
    public void changeTravelInfo(Trip trip, long travelId, String newInfo) {
        // Trova travel
        Travel travel = getTravelById(travelId);

        // Controlla che il travel faccia parte della trip
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

        final String[] cityInfo = newPlace.split(",");
        // Cambia valore
        event.setPlace(cityRepository.findFirstByNameAndCountryIgnoreCase(cityInfo[0].strip(), cityInfo[1].strip()).get()); // FIXME: unsafe call to find

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



    /************************** OVERNIGHT STAY **************************/

    public OvernightStay createOvernightStay(List<Night> nights, OvernightStayDTO overnightStayDTO) {

        OvernightStay overnightStay = new OvernightStay();

        // Imposta i campi
        overnightStay.setName(overnightStayDTO.getName());
        overnightStay.setAddress(overnightStayDTO.getAddress());
        overnightStay.setContact(overnightStayDTO.getContact());
        overnightStay.setStartDate(overnightStayDTO.getStartDate());
        overnightStay.setEndDate(overnightStayDTO.getEndDate());
        overnightStay.setStartCheckInTime(overnightStayDTO.getStartCheckInTime());
        overnightStay.setEndCheckInTime(overnightStayDTO.getEndCheckInTime());
        overnightStay.setStartCheckOutTime(overnightStayDTO.getStartCheckOutTime());
        overnightStay.setEndCheckOutTime(overnightStayDTO.getEndCheckOutTime());
        overnightStay.setTravelDays(nights);

        return overnightStayRepository.save(overnightStay);
    }

    public OvernightStay editOvernightStay(List<Night> nights, OvernightStayDTO overnightStayDTO) {

        OvernightStay overnightStay = getOvernightStayById(overnightStayDTO.getId());

        // Imposta i campi
        overnightStay.setName(overnightStayDTO.getName());
        overnightStay.setAddress(overnightStayDTO.getAddress());
        overnightStay.setContact(overnightStayDTO.getContact());
        overnightStay.setStartDate(overnightStayDTO.getStartDate());
        overnightStay.setEndDate(overnightStayDTO.getEndDate());
        overnightStay.setStartCheckInTime(overnightStayDTO.getStartCheckInTime());
        overnightStay.setEndCheckInTime(overnightStayDTO.getEndCheckInTime());
        overnightStay.setStartCheckOutTime(overnightStayDTO.getStartCheckOutTime());
        overnightStay.setEndCheckOutTime(overnightStayDTO.getEndCheckOutTime());
        overnightStay.setTravelDays(nights);

        return overnightStayRepository.save(overnightStay);
    }


    public void addAttachmentToEvent(Long eventId, Long attachmentId) {
        Event event = eventRepository.findById(eventId).orElseThrow(()-> new ResourceNotFoundException("Event not found!"));
        Attachment attachment = attachmentRepository.findById(attachmentId).orElseThrow(()-> new ResourceNotFoundException("Attachment not found!"));
        event.addAttachment(attachment);
    }

    public void addAttachmentToEvent(Long eventId, List<Long> attachmentIds) {
        Event event = eventRepository.findById(eventId).orElseThrow(()-> new ResourceNotFoundException("Event not found!"));
        List<Attachment> attachments = attachmentRepository.findAllById(attachmentIds);
        if (attachments.isEmpty()){
            throw new ResourceNotFoundException("no Attachment found!");
        }
        event.addAttachments(attachments);
        eventRepository.save(event);
        attachmentRepository.saveAll(attachments);
    }

    public void unlinkAttachmentFromEvent(Long eventId, Long attachmentId) {
        Event event = eventRepository.findById(eventId).orElseThrow(()-> new ResourceNotFoundException("Event not found!"));
        Attachment attachment = attachmentRepository.findById(attachmentId).orElseThrow(()-> new ResourceNotFoundException("Attachment not found!"));
        event.setAttachments(event.getAttachments().stream().filter(a -> !Objects.equals(a.getId(), attachmentId)).collect(Collectors.toSet()));
        attachment.setAttachedTo(null);
        eventRepository.save(event);
        attachmentRepository.save(attachment);
    }

}
