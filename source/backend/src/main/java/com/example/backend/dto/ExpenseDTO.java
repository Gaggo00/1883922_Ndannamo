package com.example.backend.dto;

import com.example.backend.model.Expense;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Data
public class ExpenseDTO {

    private Long id;

    // id della trip
    private Long tripId;

    // id dell'utente che ha pagato
    private long paidBy;
    private String paidByNickname;

    @NotBlank(message = "Name can't be empty")
    private String title;

    @NotBlank(message = "Date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    private double amount;

    private boolean splitEven;
    private boolean refund;
    
    List<AmountUserDTO> amountPerUser = new ArrayList<>();
}
