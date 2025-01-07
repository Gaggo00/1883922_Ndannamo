package com.example.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.example.backend.model.OvernightStay;
import com.fasterxml.jackson.annotation.JsonFormat;

import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// Unica classe DTO per: Activity, Night, Travel. Quindi questa classe deve avere abbastanza campi da coprire le informazioni
// di tutte e tre queste classi. Sono poi i tre mapper NightMapper, ActivityMapper e TravelMapper a mettere a "null" i campi
// che non li riguardano, e a impostare il campo "type" nel modo giusto.
// In questo modo mandiamo al frontend una lista di EventDTO, e il frontend analizzando il type capisce quali campi
// andarsi a leggere.

@Data
public class EventDTO {

    private String type;        // "ACTIVITY", "NIGHT" o "TRAVEL"

    // Per tutti e tre
    private Long id;
    private String place;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;


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

    // Per Activity
    private String name;
    private String info;

    // Per Night
    private OvernightStayDTO overnightStay = null;
}
