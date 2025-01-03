package com.example.backend.model;

import java.time.LocalDate;
import java.util.ArrayList;
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
    private LocalDate date;
    private double amount;
    private boolean splitEven;
    
    /*
    @ElementCollection
    @CollectionTable(
            name="amount_per_user",
            joinColumns=@JoinColumn(name="expense_id")
    ) 
    List<AmountUserDTO> amountPerUser = new ArrayList<>();
    */

    
    @ElementCollection              // Indicates that the map is a collection of elements that are not entities themselves
    @MapKeyColumn(name="user_id")  // Specifies the column in the collection table that will store the map's keys
    @Column(name="amount")          // Specifies the column in the collection table that will store the map's values
    // Defines the table that will be used to store the map
    //The joinColumns attribute specifies the foreign key column that links the map entries to the entity
    @CollectionTable(name="amount_per_user", joinColumns=@JoinColumn(name="expense_id"))
    private Map<Long, Double> amountPerUser;
    
}

