package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseCreationRequest {
    private long tripId;
    @NotBlank(message = "Name can't be empty")
    private String title;
    private String paidBy;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private double amount;
    private boolean splitEven;
    
    //private Map<String, Double> amountUser = new HashMap<String, Double>();
}
