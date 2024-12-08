package com.example.backend.mapper;

import com.example.backend.dto.TripDTO;
import com.example.backend.model.Trip;
import com.example.backend.model.User;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface TripMapper {

    // Map Trip entity to TripDTO (mappa i partecipanti senza cicli)
    //@Mapping(target = "list_participants", ignore = true) // Ignora i partecipanti per evitare complessità
    @Mapping(target = "createdBy", source = "created_by.id") // Mappa solo l'ID del creatore
    @Mapping(target = "list_participants", source = "participants", qualifiedByName = "userListToIdList")
    TripDTO toDTO(Trip trip);

    // Map TripDTO to Trip entity (ignora i dettagli complessi)
    @Mapping(target = "participants", ignore = true)       // Ignora i partecipanti
    @Mapping(target = "created_by.id", source = "createdBy") // Mappa l'ID del creatore verso l'entità User
    Trip toEntity(TripDTO tripDTO);

    
    @Named("userToId") 
    public static Long userToId(User user) { 
        return user.getId(); 
    }
    @Named("userListToIdList") 
    public static List<String> userListToIdList(List<User> users) { 
        // Converto la lista di user in lista di id
        List<String> userIds = users.stream()
            .map(user -> user.getNickname())
            .collect(Collectors.toList());

        return userIds;
    }
}

