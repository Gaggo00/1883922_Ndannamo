package com.example.backend.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.example.backend.dto.AmountUserDTO;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="expenses")
public class Expense {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @ManyToOne
    private Trip trip;

    private String title;

    private Long paidBy;
    private String paidByNickname;

    private LocalDate date;
    private double amount;
    private boolean splitEven;
    
    @ElementCollection              // Indicates that the map is a collection of elements that are not entities themselves
    @CollectionTable(
        name="amount_per_user",
        joinColumns=@JoinColumn(name="expense_id")
    )
    List<AmountUserDTO> amountPerUser = new ArrayList<>();
}

