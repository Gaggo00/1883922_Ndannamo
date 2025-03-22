package com.example.backend.model;


import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="nights")
@DiscriminatorValue("NIGHT")
public class Night extends Event {

    // Per EventDTO
    private EventType type = EventType.NIGHT;

    @ManyToOne
    @JoinColumn(name = "overnightStay_id", nullable = true)
    private OvernightStay overnightStay = null;
}
