package com.example.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OvernightStayDTO {
    
    private Long id = (long) -1;
    
    @NotNull
    private String name;

    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime startCheckInTime;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime endCheckInTime;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime startCheckOutTime;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime endCheckOutTime;

    private String address;
    private String contact;
}
