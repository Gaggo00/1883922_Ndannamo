package com.example.dannamo.repositories;

import com.example.dannamo.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip, Long> {

    Optional<Trip> findById(Long id);
}
