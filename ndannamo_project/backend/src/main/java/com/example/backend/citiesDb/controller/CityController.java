package com.example.backend.citiesDb.controller;

import com.example.backend.citiesDb.model.City;
import com.example.backend.citiesDb.service.CityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/cities")
public class CityController {
    
    private final CityService cityService;

    @Autowired
    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/city")
    public ResponseEntity<?> postCity(@RequestBody City newCity) {
        try {
            cityService.addCity(newCity);

            return ResponseEntity.ok("OK!");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/rome")
    public ResponseEntity<?> getRomeCountry() {
        try {
            City city = cityService.getCityByName("Rome");

            return ResponseEntity.ok(city);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                //.body(ex.getMessage());
                .body("errore in get rome!!");
        }
    }
}
