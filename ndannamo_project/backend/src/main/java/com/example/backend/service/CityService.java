package com.example.backend.service;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.City;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.repositories.CityRepository;

@Service
public class CityService {
    
    private final CityRepository cityRepository;

    @Autowired
    public CityService(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    public City getCityById(Long id) {
        return cityRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("City not found!"));
    }

    public City getCityByName(String name) {
        return cityRepository.findByName(name).orElseThrow(()-> new ResourceNotFoundException("City not found!"));
    }

    public City getCityByNameAndCountry(String name, String country) {
        return cityRepository.findFirstByNameAndCountryIgnoreCase(name, country).orElseThrow(()-> new ResourceNotFoundException("City not found!"));
    }

    public List<City> getCityByNameStartsWith(String nameStarts) {
        return cityRepository.findByNameIgnoreCaseStartsWith(nameStarts).orElseThrow(()-> new ResourceNotFoundException("City not found!"));
    }
}