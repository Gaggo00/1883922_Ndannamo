package com.example.backend.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class UserDTO {
    private long id;
    @NotBlank(message = "Email is required")
    private String email;
    private List<TripDTO> trips = new ArrayList<>();
}
