package com.example.backend.repositories;

import com.example.backend.model.Night;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface NightRepository extends JpaRepository<Night, Long> {}
