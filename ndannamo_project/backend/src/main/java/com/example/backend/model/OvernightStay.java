package com.example.backend.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OvernightStay {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "overnightStay", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Night> travelDays;

    @NotNull
    private LocalDate startDate;
    @NotNull
    private LocalDate endDate;

    private String address;
    private String contact;
    private String name;



}
