package com.example.backend.repositories;

import com.example.backend.model.OvernightStay;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OvernightStayRepository  extends JpaRepository<OvernightStay, Long> {
    Optional<OvernightStay> findById(Long id);
}
