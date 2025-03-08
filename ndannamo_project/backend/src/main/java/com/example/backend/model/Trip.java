package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Entity
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("TRIP")
public class Trip extends AttachableEntity {

    private String title;
    private List<String> locations; // FIXME: list of strings is not a real type in database
    private LocalDate creationDate;
    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name="created_by", nullable=false, foreignKey = @ForeignKey(name = "fk_trip_created_by"))
    private User created_by;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "trips_participation", 
        joinColumns = @JoinColumn(name = "trip_id"), 
        inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> participants = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "trips_invitations",
            joinColumns = @JoinColumn(name = "trip_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> invitations = new ArrayList<>();


    // attivita'/viaggi/notti della trip
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Event> schedule = new ArrayList<>();


    // spese della trip
    @OneToMany
    private List<Expense> expenses = new ArrayList<>();


    // foto della trip
    @OneToMany
    private List<ImageData> photos = new ArrayList<>();


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

    public boolean removePhoto(ImageData photo) {
        if (this.photos.contains(photo)) {
            this.photos.remove(photo);
            return true;
        }
        return false;
    }

}
