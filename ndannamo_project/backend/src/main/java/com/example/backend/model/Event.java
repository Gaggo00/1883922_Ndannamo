package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@MappedSuperclass
public abstract class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String place;

//    @OneToMany(mappedBy = "relatedEvent", cascade = CascadeType.ALL, orphanRemoval = true)
//    private Set<Attachments> attachments;






}
