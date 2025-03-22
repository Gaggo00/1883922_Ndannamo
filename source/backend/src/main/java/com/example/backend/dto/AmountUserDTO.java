package com.example.backend.dto;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
//@Embeddable
@Entity
public class AmountUserDTO implements Serializable {
    private Long user;
    private String userNickname;
    private Double amount;
}
