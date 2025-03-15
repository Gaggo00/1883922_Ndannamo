package com.example.backend.service;

import com.example.backend.exception.ResourceNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

import com.example.backend.model.City;
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

    //FIXME: not safe
    public List<City> getFromListNamesCountries(List<String> locations) {
        return locations.stream().map(l -> getCityByNameAndCountry(
                l.split(",")[0].strip(), l.split(",")[1].strip())).collect(Collectors.toList());
    }
}