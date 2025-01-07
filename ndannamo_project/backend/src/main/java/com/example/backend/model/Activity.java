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

    // Per EventDTO
    private EventType type = EventType.ACTIVITY;

    private String name;
    private LocalTime startTime;

    @Nullable
    private LocalTime endTime = null;       // non e' detto che ci sia

    private String address;
    private String info;
}
