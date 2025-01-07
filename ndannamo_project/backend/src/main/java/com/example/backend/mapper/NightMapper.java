package com.example.backend.mapper;

import com.example.backend.dto.EventDTO;
import com.example.backend.model.Night;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring", uses = OvernightStayMapper.class)
public interface NightMapper {

    // Da Night a EventDTO
    @Mapping(target = "destination", ignore = true)
    @Mapping(target = "arrivalDate", ignore = true)
    @Mapping(target = "startTime", ignore = true)
    @Mapping(target = "endTime", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "address", ignore = true)
    @Mapping(target = "info", ignore = true)
    EventDTO toDTO(Night night);

    // Da EventDTO a Night
    @Mapping(target = "trip", ignore = true)
    Night toEntity(EventDTO eventDTO);

}