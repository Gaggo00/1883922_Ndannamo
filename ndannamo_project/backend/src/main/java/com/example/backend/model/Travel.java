package com.example.backend.model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name="travels")
//@DiscriminatorValue("TRAVEL")
public class Travel extends Event {

    // Per EventDTO
    //private EventType type = EventType.TRAVEL;

    private String address;         // tipo il nome dell'aeroporto, o della stazione, ecc
    private String destination;

    private LocalDate departureDate;

    // La data di partenza gia' ce l'ha perché la prende dalla classe Event
    private LocalDate arrivalDate;      // se non e' un viaggio tra due giorni diversi, sara' uguale alla data di partenza

    private LocalTime departureTime;
    private LocalTime arrivalTime;

    private String info;    // tipo il gate, o il binario
}
