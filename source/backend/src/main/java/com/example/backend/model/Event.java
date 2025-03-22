package com.example.backend.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;
import java.util.Set;


@Entity
//@Inheritance(strategy = InheritanceType.JOINED)
//@DiscriminatorColumn(name = "event_type")
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS) // ALE TI PREGO NON CAMBIARLO DI NUOVO CHE SE NO SMETTE DI FUNZIONARE DI NUOVO ;-; L'HO GIA' CAMBIATO 2 VOLTE
@Data
@NoArgsConstructor
@AllArgsConstructor
public abstract class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    public enum EventType {ACTIVITY, NIGHT, TRAVEL};
    private EventType type;

    @ManyToOne
    @JoinColumn(name="trip_id", nullable=false)
    private Trip trip;

    private String place;
    
    private LocalDate date;

    @OneToMany(mappedBy = "event")
    private Set<Attachment> attachments;

    public void addAttachment(Attachment attachment) {
        this.attachments.add(attachment);
    }

    public void addAttachments(Collection<Attachment> attachments) {
        attachments.forEach(attachment -> attachment.setEvent(this));
        this.attachments.addAll(attachments);
    }


}
