package com.example.backend.repositories;

import com.example.backend.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {}
