package com.example.backend.model;


import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Table(name="nights")
@DiscriminatorValue("NIGHT")
public class Night extends Event {

    @ManyToOne
    @JoinColumn(name = "overnightStay_id", foreignKey = @ForeignKey(name = "fk_overnightStay_night"))
    private OvernightStay overnightStay = null;
}
