package com.example.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.example.backend.model.Night;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OvernightStayDTO {
    
    private Long id;
    
    //private List<Long> travelDays;        // id delle notti

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
