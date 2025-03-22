package com.example.backend.repositories;

import com.example.backend.model.Travel;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TravelRepository extends JpaRepository<Travel, Long> {

    Optional<Travel> findById(Long id);
}
