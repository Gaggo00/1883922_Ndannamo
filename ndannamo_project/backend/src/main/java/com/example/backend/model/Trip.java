package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @OneToMany(fetch = FetchType.LAZY)
    private List<City> locations; // FIXME: list of strings is not a real type in database
    private LocalDate creationDate;
    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name="created_by", nullable=false, foreignKey = @ForeignKey(name = "fk_trip_created_by"))
    private User created_by;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "trips_participation", 
        joinColumns = @JoinColumn(name = "trip_id"), 
        inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> participants = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "trips_invitations",
            joinColumns = @JoinColumn(name = "trip_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> invitations = new ArrayList<>();


    // attivita'/viaggi/notti della trip
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Event> schedule = new ArrayList<>();


    // spese della trip
    @OneToMany(fetch = FetchType.LAZY, orphanRemoval=true, cascade = CascadeType.ALL, mappedBy = "trip")
    private List<Expense> expenses = new ArrayList<>();


    // foto della trip
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "trip", orphanRemoval = true)
    private Set<Attachment> attachments = new HashSet<>();


    public boolean removeInvitation(User user) {
        if (this.invitations.contains(user)) {
            this.invitations.remove(user);
            return true;
        }
        return false;
    }

    public boolean removeParticipant(User user) {
        if (this.participants.contains(user)) {
            this.participants.remove(user);
            return true;
        }
        return false;
    }

    public boolean addInvitation(User user) {
        if (!this.invitations.contains(user)) {
            this.invitations.add(user);
            return true;
        }
        return false;
    }

    public void addAttachments(Collection<Attachment> attachments){
        this.attachments.addAll(attachments);
    }

    //TODO: cambiare filtro?
    public List<Attachment> getPhotos(){
        return this.attachments.stream().filter(attachment -> attachment.getFileType().startsWith("image")).collect(Collectors.toList());
    }

    public boolean removeAttachment(final Attachment attachment) {
        if (this.attachments.contains(attachment)) {
            this.attachments.remove(attachment);
            return true;
        }
        return false;
    }

}
