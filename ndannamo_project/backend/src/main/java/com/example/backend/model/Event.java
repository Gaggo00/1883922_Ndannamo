package com.example.backend.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
//@Inheritance(strategy = InheritanceType.JOINED)
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS) 
@Getter
@Setter
//@MappedSuperclass
public abstract class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    public enum EventType {ACTIVITY, NIGHT, TRAVEL};
    private EventType type;       // serve per EventDTO

    @ManyToOne
    @JoinColumn(name="trip_id", nullable=false)
    private Trip trip;

    private String place;
    
    private LocalDate date;

//    @OneToMany(mappedBy = "relatedEvent", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<Attachments> attachments;


}
