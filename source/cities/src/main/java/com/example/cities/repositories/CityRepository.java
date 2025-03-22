package com.example.cities.repositories;

import com.example.cities.model.City;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CityRepository extends JpaRepository<City, Long> {

    Optional<City> findById(Long id);

    Optional<City> findByName(String name);

    Optional<City> findFirstByNameAndCountryIgnoreCase(String name, String country);

    Optional<List<City>> findByNameIgnoreCaseStartsWith(String nameStart);
}
