package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExpenseCreationRequest {
    private String title;
    private String paidByNickname;
    private Long paidById;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private double amount;
    private Boolean splitEven;
    
    List<AmountUserDTO> amountPerUser = new ArrayList<>();
}
