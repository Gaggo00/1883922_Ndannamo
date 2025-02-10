package com.example.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String nickname;    // non lo si puo' chiamare username se no va in errore tutto

    @NotBlank
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "created_by")
    private List<Trip> trips_created = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "trips_participation", 
        joinColumns = @JoinColumn(name = "user_id"), 
        inverseJoinColumns = @JoinColumn(name = "trip_id"))
    private List<Trip> trips = new ArrayList<>();

    // Trip a cui sei stato invitato che non hai ancora accettato/rifiutato
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "trips_invitations",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "trip_id"))
    private List<Trip> invitations = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_"+role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
    public enum Role {
        USER, ADMIN
    }

    public boolean addInvitation(Trip trip) {
        if (!this.invitations.contains(trip)) {
            this.invitations.add(trip);
            return true;
        }
        return false;
    }

    public void manageInvitation(Trip trip, boolean acceptInvitation) {
        invitations.remove(trip);

        if (acceptInvitation) {
            trips.add(trip);
        }
    }
}
