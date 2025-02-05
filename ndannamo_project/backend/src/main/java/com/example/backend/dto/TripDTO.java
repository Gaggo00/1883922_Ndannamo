package com.example.backend.dto;

import com.example.backend.model.Expense;
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
    @NotBlank(message = "Location is required")
    private List<String> locations;
    @NotBlank(message = "Creation date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate creationDate;
    @NotBlank(message = "Start date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate startDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate endDate;
    private long createdBy;
    private String createdByName;
    private List<String> list_participants = new ArrayList<>();
    private List<String> list_invitations = new ArrayList<>();
    private boolean isCreator = false;
    
    //private List<Expense> expenses = new ArrayList<>();
}
