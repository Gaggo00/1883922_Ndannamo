package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String title;
    private List<String> locations;
    private LocalDate creationDate;
    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name="created_by", nullable=false)
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
    @OneToMany(
        fetch = FetchType.EAGER,
        mappedBy = "trip" //,
        /*cascade = CascadeType.ALL,*/
        /*orphanRemoval = true*/
    )
    private List<Event> schedule = new ArrayList<>();


    // spese della trip
    @OneToMany(
        fetch = FetchType.EAGER,
        mappedBy = "trip",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<Expense> expenses = new ArrayList<>();


    // foto della trip
    @OneToMany(
            fetch = FetchType.LAZY,
            mappedBy = "trip",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
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

    public boolean removeEvent(Event event) {
        if (this.schedule.contains(event)) {
            this.schedule.remove(event);
            return true;
        }
        return false;
    }

}
