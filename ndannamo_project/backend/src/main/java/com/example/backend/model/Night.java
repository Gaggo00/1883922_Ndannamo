package com.example.backend.model;


import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="nights")
public class Night extends Event {

    // Per EventDTO
    private EventType type = EventType.NIGHT;

    @ManyToOne
    @JoinColumn(name = "overnightStay_id", nullable = true)
    private OvernightStay overnightStay = null;
}
