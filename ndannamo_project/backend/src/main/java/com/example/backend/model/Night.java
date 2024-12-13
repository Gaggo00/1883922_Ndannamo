package com.example.backend.model;


import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalTime;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Night extends Event {


    @ManyToOne
    @JoinColumn(name = "overnightStay_id", nullable = false)
    private OvernightStay overnightStay;

    private LocalTime startCheckInTime;
    private LocalTime endCheckInTime;
    private LocalTime startCheckOutTime;
    private LocalTime endCheckOutTime;

}
