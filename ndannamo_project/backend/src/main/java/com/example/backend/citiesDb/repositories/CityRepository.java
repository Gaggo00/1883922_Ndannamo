package com.example.backend.citiesDb.repositories;

import com.example.backend.citiesDb.model.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CityRepository extends JpaRepository<City, Long> {

    Optional<City> findById(Long id);

    Optional<City> findByCityName(String cityName);
}
