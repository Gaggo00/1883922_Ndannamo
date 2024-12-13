package com.example.backend.model;


import jakarta.persistence.Entity;
import lombok.*;
import java.time.LocalTime;

@Entity
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Activity extends Event {

    private String name;
    private String address;
    private LocalTime timeStart;
    private LocalTime timeEnd;






}
