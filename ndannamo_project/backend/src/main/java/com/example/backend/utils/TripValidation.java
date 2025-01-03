package com.example.backend.utils;


import java.time.LocalDate;

import com.example.backend.dto.TripCreationRequest;
import com.example.backend.exception.ResourceNotFoundException;


public class TripValidation {
    
    public static final int TITLE_MIN_LENGTH = 1;
    public static final int TITLE_MAX_LENGTH = 30;
    


    public static boolean titleValid(String title) {
        return (title.length() >= TITLE_MIN_LENGTH) && (title.length() <= TITLE_MAX_LENGTH);
    }


    public static boolean datesValid(LocalDate startDate, LocalDate endDate) {
        return endDate.isAfter(startDate);
    }


    public static boolean tripValid(TripCreationRequest tripRequest) {
        boolean res = true;

        res = res &&  titleValid(tripRequest.getTitle());
        
        // controlla che la data di inizio non sia prima di oggi
        res = res && !(LocalDate.now().isAfter(tripRequest.getStartDate()) );

        // controlla che la data di fine sia dopo quella di inizio
        res &= datesValid(tripRequest.getStartDate(), tripRequest.getEndDate());

        return res;
    }
}
