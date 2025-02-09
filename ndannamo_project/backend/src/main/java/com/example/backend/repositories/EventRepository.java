package com.example.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.Event;
import java.util.Optional;

public interface EventRepository  extends JpaRepository<Event, Long> {
    
    Optional<Event> findById(Long id);
}
