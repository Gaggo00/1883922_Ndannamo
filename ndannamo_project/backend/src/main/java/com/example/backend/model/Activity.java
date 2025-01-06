package com.example.backend.model;


import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import java.time.LocalTime;

import io.micrometer.common.lang.Nullable;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="activities")
public class Activity extends Event {

    private String name;
    private String address;
    private LocalTime startTime;
    
    @Nullable
    private LocalTime endTime = null;       // non e' detto che ci sia

}
