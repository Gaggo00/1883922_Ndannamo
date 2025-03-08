package com.example.backend.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("OVERNIGHT_STAY")
public class OvernightStay extends AttachableEntity {

    @OneToMany(mappedBy = "overnightStay", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
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
