package com.example.backend.mapper;

import com.example.backend.model.City;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EventMapper {

    default City mapStringToCity(String place) {
        if (place == null) {
            return null;
        }
        City city = new City();
        city.setName(place); // Supponendo che City abbia un campo "name"
        return city;
    }
}
