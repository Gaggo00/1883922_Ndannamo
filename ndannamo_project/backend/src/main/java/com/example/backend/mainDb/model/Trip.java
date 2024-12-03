package com.example.backend.mainDb.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String title;
    private String description;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name="created_by", nullable=false)
    private User created_by;
    @ManyToMany(fetch = FetchType.EAGER)
    private List<User> participants = new ArrayList<>();

}
