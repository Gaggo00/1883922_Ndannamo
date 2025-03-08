package com.example.backend.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.Collection;


@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "event_type")
@DiscriminatorValue("EVENT")
@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class Event extends AttachableEntity{

    @ManyToOne
    @JoinColumn(name="trip_id", nullable=false, foreignKey = @ForeignKey(name = "event_trip_fk"))
    private Trip trip;

    @Embedded
    private Address location;
    
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "city_id", foreignKey = @ForeignKey(name = "fk_event_city"))
    private City place;
    private String placeName;

    public Event(Trip trip, Address location, LocalDate date, City place) {
        this.trip = trip;
        this.location = location;
        this.date = date;
        setPlace(place);
    }

    public void setCity(final City city) {
        this.place = city;
        this.placeName = city.getName() + ", " + city.getCountry();
    }


}
