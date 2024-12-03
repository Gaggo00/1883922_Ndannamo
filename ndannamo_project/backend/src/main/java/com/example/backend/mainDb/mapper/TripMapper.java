package com.example.backend.mainDb.mapper;

import com.example.backend.mainDb.dto.TripDTO;
import com.example.backend.mainDb.model.Trip;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface TripMapper {

    // Map Trip entity to TripDTO (mappa i partecipanti senza cicli)
    @Mapping(target = "list_participants", ignore = true) // Ignora i partecipanti per evitare complessità
    @Mapping(target = "createdBy", source = "created_by.id") // Mappa solo l'ID del creatore
    TripDTO toDTO(Trip trip);

    // Map TripDTO to Trip entity (ignora i dettagli complessi)
    @Mapping(target = "participants", ignore = true)       // Ignora i partecipanti
    @Mapping(target = "created_by.id", source = "createdBy") // Mappa l'ID del creatore verso l'entità User
    Trip toEntity(TripDTO tripDTO);
}

