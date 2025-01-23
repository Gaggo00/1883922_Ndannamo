package com.example.backend.utils;

import java.time.LocalDate;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Event;
import com.example.backend.model.Trip;

public class EventValidation {
    
    // Per activity
    public static final int ACTIVITY_NAME_MIN_LENGTH = 1;
    public static final int ACTIVITY_NAME_MAX_LENGTH = 30;

    // Per activity e travel
    public static final int ADDRESS_MAX_CHARACTERS = 60;
    public static final int INFO_MAX_CHARACTERS = 500;



    // Per place di activity, travel e night, per destination di travel
    public static boolean placeValid(String place) {
        /*
        // TODO
        if (false) {
            throw new ResourceNotFoundException("Place not valid");
        }
        */
        return true;
    }


    // Per name di activity
    public static boolean nameValid(String name) {
        if (name.length() < ACTIVITY_NAME_MIN_LENGTH || name.length() > ACTIVITY_NAME_MAX_LENGTH) {
            throw new ResourceNotFoundException("Activity name must be long " + ACTIVITY_NAME_MIN_LENGTH
             + " to " + ACTIVITY_NAME_MAX_LENGTH + " characters");
        }
        return true;
    }

    // Per address di activity e travel
    public static boolean addressValid(String address) {
        if (address.length() > ADDRESS_MAX_CHARACTERS) {
            throw new ResourceNotFoundException("Address must be long at most " + ADDRESS_MAX_CHARACTERS + " characters");
        }
        return true;
    }

    // Per info di activity e travel
    public static boolean infoValid(String info) {
        if (info.length() > INFO_MAX_CHARACTERS) {
            throw new ResourceNotFoundException("Info must be long at most " + INFO_MAX_CHARACTERS + " characters");
        }
        return true;
    }

    // Per date di activity e travel, per arrivalDate di travel
    public static boolean dateValid(Trip trip, LocalDate eventDate) {
        if (trip.getStartDate().isAfter(eventDate)) {
            throw new ResourceNotFoundException("Event date can't be before trip start date");
        }
        if (eventDate.isAfter(trip.getEndDate())) {
            throw new ResourceNotFoundException("Event date can't be after trip end date");
        }
        return true;
    }




}
