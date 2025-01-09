package com.example.backend.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.City;
import com.example.backend.service.CityService;

import jakarta.validation.Valid;



@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/cities")
public class CityController {

    private final CityService cityService;

    @Autowired
    public CityController(CityService cityService) {
        this.cityService = cityService;
    }


    // Ottieni city dall'id
    @GetMapping(value={"/{id}", "/{id}/"})
    public ResponseEntity<?> getCityById(@PathVariable Long id) {
        try {
            // ottieni city
            final City city = cityService.getCityById(id);
            return ResponseEntity.ok().body(city);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Ottieni city il cui nome inizia con il testo passato nell'url
    @GetMapping(value={"/name/{start}", "/name/{start}/"})
    public ResponseEntity<?> getCityByNameStartsWith(@PathVariable String start) {
        try {
            // ottieni cities
            final List<City> cities = cityService.getCityByNameStartsWith(start);
            return ResponseEntity.ok().body(cities);
        }
        catch (ResourceNotFoundException ex) {
            // restituisci una lista vuota
            final List<City> cities = new ArrayList<City>();
            return ResponseEntity.ok().body(cities);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }


    // Ottieni immagine di una city dal nome e country
    @GetMapping(value={"/image", "/image/"})
    public ResponseEntity<?> getImageByNameAndCountry(@RequestParam("name") String name, @RequestParam("country") String country) {
        try {
            // ottieni cities
            City city = cityService.getCityByNameAndCountry(name, country);
            return ResponseEntity.ok().body(city.getImage());
        }
        catch (ResourceNotFoundException ex) {
            // restituisci la stringa "-" -> necessario in caso un utente metta una destinazione non riconosciuta
            return ResponseEntity.ok().body("-");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    // Ottieni coordinate di una city dal nome e country
    @GetMapping(value={"/coordinates", "/coordinates/"})
    public ResponseEntity<?> getCoordinatesByNameAndCountry(@RequestParam("name") String name, @RequestParam("country") String country) {
        try {
            // ottieni cities
            City city = cityService.getCityByNameAndCountry(name, country);
            return ResponseEntity.ok().body(city.getLatitude() + "," + city.getLongitude());
        }
        catch (ResourceNotFoundException ex) {
            // restituisci la stringa "-" -> necessario in caso un utente metta una destinazione non riconosciuta
            return ResponseEntity.ok().body("");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }
}