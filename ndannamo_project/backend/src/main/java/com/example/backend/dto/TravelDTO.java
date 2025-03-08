package com.example.backend.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TravelDTO extends EventDTO {



    /***** CAMPI OPZIONALI *****/

    // Per Travel
    private String destination;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate arrivalDate;

    // Per Travel e Activity
    private String address;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;        // sarebbe "startTime" in Activity, e "departureTime" in Travel
    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;          // sarebbe "endTime" in Activity, e "arrivalTime" in Travel
    private String info;
}
