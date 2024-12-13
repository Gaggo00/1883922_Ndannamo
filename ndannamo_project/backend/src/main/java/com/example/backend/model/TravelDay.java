package com.example.backend.model;


import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TravelDay extends Event{

    @ManyToOne
    @JoinColumn(name = "travel_id", nullable = false)
    private Travel travel;
}
