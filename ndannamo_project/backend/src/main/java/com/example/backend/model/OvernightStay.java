package com.example.backend.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OvernightStay {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToMany(mappedBy = "overnightStay")
    private List<Night> travelDays;

    @NotNull
    private LocalDate startDate;
    @NotNull
    private LocalDate endDate;

    private LocalTime startCheckInTime;
    private LocalTime endCheckInTime;
    private LocalTime startCheckOutTime;
    private LocalTime endCheckOutTime;


    private String address;
    private String contact;
    private String name;



}
