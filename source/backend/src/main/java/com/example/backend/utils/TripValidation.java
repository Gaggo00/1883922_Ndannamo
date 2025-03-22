package com.example.backend.utils;


import java.time.LocalDate;

import com.example.backend.dto.TripCreationRequest;
import com.example.backend.exception.ResourceNotFoundException;


public class TripValidation {
    
    // Titolo, lunghezza min e max
    public static final int TITLE_MIN_LENGTH = 1;
    public static final int TITLE_MAX_LENGTH = 30;
    
    // Durata massima di una trip in giorni
    public static final int TRIP_MAX_DAYS = 31;



    public static boolean titleValid(String title) {
        if ((title.length() < TITLE_MIN_LENGTH) || (title.length() > TITLE_MAX_LENGTH)) {
            throw new ResourceNotFoundException("Trip title must be long " + TITLE_MIN_LENGTH
            + " to " + TITLE_MAX_LENGTH + " characters");
        }
        return true;
    }


    public static boolean datesValid(LocalDate startDate, LocalDate endDate) {
        // controlla che la data di inizio non sia prima di oggi
        if (LocalDate.now().isAfter(startDate)) {
            throw new ResourceNotFoundException("Trip start date must be a future date");
        }
        // controlla che la data di fine sia dopo quella di inizio
        if (!endDate.isAfter(startDate)) {
            throw new ResourceNotFoundException("Trip end date must be after trip start date");
        }
        // controlla durata trip
        if (startDate.until(endDate, java.time.temporal.ChronoUnit.DAYS) > TRIP_MAX_DAYS) {
            throw new ResourceNotFoundException("Trip can be at most " + TRIP_MAX_DAYS + " days long");
        }
        return true;
    }

    public static boolean datesValidAllowPastDates(LocalDate startDate, LocalDate endDate) {
        // controlla che la data di fine sia dopo quella di inizio
        if (!endDate.isAfter(startDate)) {
            throw new ResourceNotFoundException("Trip end date must be after trip start date");
        }
        // controlla durata trip
        if (startDate.until(endDate, java.time.temporal.ChronoUnit.DAYS) > TRIP_MAX_DAYS) {
            throw new ResourceNotFoundException("Trip can be at most " + TRIP_MAX_DAYS + " days long");
        }
        return true;
    }

    public static boolean tripValid(TripCreationRequest tripRequest) {
        boolean res = true;

        res = res && titleValid(tripRequest.getTitle());

        res &= datesValid(tripRequest.getStartDate(), tripRequest.getEndDate());

        return res;
    }
}
