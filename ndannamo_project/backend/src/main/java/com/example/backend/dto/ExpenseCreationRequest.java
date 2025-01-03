package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.node.ObjectNode;

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
    private String title;
    private Long paidById;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private double amount;
    private Boolean splitEven;
    
    List<AmountUserDTO> amountPerUser = new ArrayList<>();
    //List<ObjectNode> amountPerUser = new ArrayList<>();   // Lista di dizionari tipo [ {"user":1, "amount":5.12},  {"user":6, "amount":8.67} ]
    //Map<String, Double> amountPerUser = new HashMap<>();
}
