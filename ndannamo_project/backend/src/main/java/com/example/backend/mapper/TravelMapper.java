package com.example.backend.mapper;



import com.example.backend.dto.TravelDTO;
import com.example.backend.model.Travel;

import jakarta.persistence.DiscriminatorValue;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring")
public interface TravelMapper extends EventMapper {

    // Da Travel a EventDTO
    @Mapping(target = "startTime", source="departureTime")
    @Mapping(target = "endTime", source="arrivalTime")
    @Mapping(target = "place", source = "placeName")
    @Mapping(target = "tripId", source="trip.id")
    TravelDTO toDTO(Travel travel);

    // Da EventDTO a Travel
    @Mapping(target = "departureTime", source="startTime")
    @Mapping(target = "arrivalTime", source="endTime")
    @Mapping(target = "trip", ignore = true)
    @Mapping(target = "location", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "departureDate", ignore = true)
    Travel toEntity(TravelDTO eventDTO);

    @AfterMapping
    default void setType(Travel entity, @MappingTarget TravelDTO dto) {
        // Ottieni il tipo di evento dalla classe dell'entità
        DiscriminatorValue discriminatorValue = entity.getClass().getAnnotation(DiscriminatorValue.class);
        if (discriminatorValue != null) {
            dto.setType(discriminatorValue.value());
        } else {
            // Se non c'è un'annotazione @DiscriminatorValue, usa il nome della classe
            dto.setType(entity.getClass().getSimpleName());
        }
    }
}