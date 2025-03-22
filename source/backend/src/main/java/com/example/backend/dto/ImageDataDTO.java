package com.example.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;


@Data
public class ImageDataDTO {
    private Long id;
    private String name;
    private String type;
    private LocalDateTime uploadDate;
    private Long tripId;
    private UserDTOSimple uploadedBy;
    private String description;
    //private byte[] imageData;
}
