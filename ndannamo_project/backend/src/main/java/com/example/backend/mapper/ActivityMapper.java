package com.example.backend.mapper;


import com.example.backend.dto.ActivityDTO;
import com.example.backend.model.Activity;


import jakarta.persistence.DiscriminatorValue;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;


@Mapper(componentModel = "spring")
public interface ActivityMapper extends EventMapper {

    // Da Activity a EventDTO
    @Mapping(target = "place", source = "placeName")
    @Mapping(target = "tripId", source="trip.id")
    ActivityDTO toDTO(Activity activity);

    // Da EventDTO a Activity
    @Mapping(target = "trip", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "location", ignore = true)
    Activity toEntity(ActivityDTO eventDTO);

    @AfterMapping
    default void setType(Activity entity, @MappingTarget ActivityDTO dto) {
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