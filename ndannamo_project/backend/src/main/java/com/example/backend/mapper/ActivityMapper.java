package com.example.backend.mapper;


import com.example.backend.dto.EventDTO;
import com.example.backend.model.Activity;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface ActivityMapper {

    // Da Activity a EventDTO
    @Mapping(target = "destination", ignore = true)
    @Mapping(target = "arrivalDate", ignore = true)
    @Mapping(target = "overnightStay", ignore = true)
    @Mapping(target = "tripId", source="trip.id")
    EventDTO toDTO(Activity activity);

    // Da EventDTO a Activity
    @Mapping(target = "trip", ignore = true)
    Activity toEntity(EventDTO eventDTO);
}