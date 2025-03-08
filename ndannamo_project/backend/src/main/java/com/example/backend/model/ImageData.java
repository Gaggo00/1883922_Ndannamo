package com.example.backend.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(name = "imageData")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageData {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    private String type;

    @ManyToOne
    private Trip trip;

    @ManyToOne
    private User uploadedBy;
    
    
    private String description;

    @Lob
    @Column(name = "imagedata", length = 1000)
    private byte[] imageData;
}