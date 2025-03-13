package com.example.cities.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="cities")
public class City {
    
    @Id
    private long id;

    private String name;
    private String country;
    private String iso;
    private double latitude;
    private double longitude;
    private String image;       // url dell'immagine
}
