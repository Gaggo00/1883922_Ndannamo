package com.example.backend.utils;


import java.time.LocalDate;

import com.example.backend.dto.TripCreationRequest;


public class TripValidation {
    
    public static boolean tripValid(TripCreationRequest tripRequest) {
        boolean res = true;

        // controlla che la data di inizio sia future
        res &= tripRequest.getStartDate().isAfter(LocalDate.now());

        // controlla che la data di fine sia dopo quella di inizio
        res &= tripRequest.getEndDate().isAfter(tripRequest.getStartDate());

        return res;
    }
}
