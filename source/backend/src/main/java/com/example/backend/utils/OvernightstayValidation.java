package com.example.backend.utils;

import com.example.backend.dto.OvernightStayDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Trip;

public class OvernightstayValidation {
 

    // Nome, lunghezza min e max
    public static final int NAME_MIN_LENGTH = 1;
    public static final int NAME_MAX_LENGTH = 40;


    public static boolean nameValid(String name) {
        if (name.length() < NAME_MIN_LENGTH || name.length() > NAME_MAX_LENGTH) {
            throw new ResourceNotFoundException("Accomodation name must be long " + NAME_MIN_LENGTH + " to " + NAME_MAX_LENGTH + " characters");
        }
        return true;
    }


    public static boolean datesValid(Trip trip, OvernightStayDTO overnightStayDTO) {
        if (!overnightStayDTO.getEndDate().isAfter(overnightStayDTO.getStartDate())) {
            throw new ResourceNotFoundException("Accomodation check-out date must be after check-in date");
        }
        if (trip.getStartDate().isAfter(overnightStayDTO.getStartDate())) {
            throw new ResourceNotFoundException("Accomodation check-in date can't be before trip start date");
        }
        if (overnightStayDTO.getEndDate().isAfter(trip.getEndDate())) {
            throw new ResourceNotFoundException("Accomodation check-out date can't be after trip end date");
        }
        return true;
    }

    public static boolean overnightStayValid(Trip trip, OvernightStayDTO overnightStayDTO) {
         
        boolean res = true;

        // Validita' nome
        res = res & OvernightstayValidation.nameValid(overnightStayDTO.getName());

        // Validita' date
        res = res & OvernightstayValidation.datesValid(trip, overnightStayDTO);

        return true;
    }
}
