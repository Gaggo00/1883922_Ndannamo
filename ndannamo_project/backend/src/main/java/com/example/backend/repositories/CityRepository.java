package com.example.backend.repositories;

import com.example.backend.model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {

    Optional<City> findByName(String name);

    Optional<City> findFirstByNameAndCountryIgnoreCase(String name, String country);

    Optional<List<City>> findByNameIgnoreCaseStartsWith(String nameStart);
}
