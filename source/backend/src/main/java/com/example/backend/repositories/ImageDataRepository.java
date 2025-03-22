package com.example.backend.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.backend.model.ImageData;


public interface ImageDataRepository extends JpaRepository<ImageData, Long> {
    
    Optional<ImageData> findByName(String name);

    Optional<ImageData> findById(Long id);
}