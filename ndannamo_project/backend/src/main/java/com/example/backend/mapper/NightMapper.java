package com.example.backend.mapper;


import com.example.backend.dto.NightDTO;
import com.example.backend.model.Night;

import jakarta.persistence.DiscriminatorValue;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring", uses = OvernightStayMapper.class)
public interface NightMapper extends EventMapper {

    // Da Night a EventDTO
    @Mapping(target = "place", source = "placeName")
    @Mapping(target = "tripId", source="trip.id")
    NightDTO toDTO(Night night);

    // Da EventDTO a Night
    @Mapping(target = "trip", ignore = true)
    @Mapping(target = "location", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    Night toEntity(NightDTO eventDTO);

    @AfterMapping
    default void setType(Night entity, @MappingTarget NightDTO dto) {
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