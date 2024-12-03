package com.example.backend.mainDb.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data

public class TripDTO {
    private Long id;
    @NotBlank(message = "Name can't be empty")
    private String title;
    private String description;
    @NotBlank(message = "Start date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @NotBlank(message = "Location is required")
    private String location;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    private Long createdBy;
    private List<UserDTO> list_participants = new ArrayList<>();
}