package com.example.backend.citiesDb.service;

import com.example.backend.citiesDb.repositories.CityRepository;
import com.example.backend.citiesDb.model.City;
import com.example.backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CityService {

    private final CityRepository cityRepository;

    @Autowired
    public CityService(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    public City addCity(City city) {
        /*
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already taken");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(User.Role.USER);
        */
        return cityRepository.save(city);
    }
    public City getCityByName(String name) {
        return cityRepository.findByCityName(name).orElseThrow(()-> new ResourceNotFoundException("City not found!"));
    }
}
