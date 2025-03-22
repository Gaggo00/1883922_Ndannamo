package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TravelCreationRequest {

    // Da Event:
    private String place;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    // Da Travel:
    private String address;
    private String destination;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate arrivalDate;      // se non e' un viaggio tra due giorni diversi, sara' uguale alla data di partenza
    @JsonFormat(pattern = "HH:mm")
    private LocalTime departureTime;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime arrivalTime;
    private String info;
}
