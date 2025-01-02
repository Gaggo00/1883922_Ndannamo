package com.example.backend.model;

import java.util.Date;
import java.util.Map;

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
    private User paidBy;
    private Date date;
    private boolean splitEven;
    
    //private Map<User, Double> amountUser;
}

