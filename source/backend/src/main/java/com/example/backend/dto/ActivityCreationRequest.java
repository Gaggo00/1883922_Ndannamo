package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import io.micrometer.common.lang.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActivityCreationRequest {

    // Da Event:
    private String place;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    // Da Activity:
    private String name;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;
    @Nullable
    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime = null;       // non e' detto che ci sia
    private String address;
    private String info;
}
