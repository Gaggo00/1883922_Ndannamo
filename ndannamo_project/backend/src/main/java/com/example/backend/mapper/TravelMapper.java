package com.example.backend.mapper;

import com.example.backend.dto.EventDTO;
import com.example.backend.model.Travel;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface TravelMapper {

    // Da Travel a EventDTO
    @Mapping(target = "startTime", source="departureTime")
    @Mapping(target = "endTime", source="arrivalTime")
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "info", ignore = true)
    @Mapping(target = "overnightStay", ignore = true)
    EventDTO toDTO(Travel travel);

    // Da EventDTO a Travel
    @Mapping(target = "departureTime", source="startTime")
    @Mapping(target = "arrivalTime", source="endTime")
    @Mapping(target = "trip", ignore = true)
    Travel toEntity(EventDTO eventDTO);
}