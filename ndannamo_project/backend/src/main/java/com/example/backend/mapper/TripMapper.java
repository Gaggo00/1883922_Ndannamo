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
    @Mapping(target = "createdBy", source = "created_by.id") // Mappa solo l'ID del creatore
    @Mapping(target = "createdByName", source = "created_by.nickname") // Mappa solo l'ID del creatore
    @Mapping(target = "list_participants", source = "participants", qualifiedByName = "userListToStringList")
    @Mapping(target = "creator", ignore = true)
    @Mapping(target = "list_invitations", source ="invitations", qualifiedByName="userListToStringList")
    TripDTO toDTO(Trip trip);

    // Map TripDTO to Trip entity (ignora i dettagli complessi)
    @Mapping(target = "participants", ignore = true)            // Ignora i partecipanti
    @Mapping(target = "invitations", ignore =true)
    @Mapping(target = "created_by.id", source = "createdBy")    // Mappa l'ID del creatore verso l'entità User
    @Mapping(target = "expenses", ignore = true)                // Ignora le spese
    @Mapping(target = "schedule", ignore = true)
    Trip toEntity(TripDTO tripDTO);

    @Named("userToId") 
    public static Long userToId(User user) { 
        return user.getId(); 
    }
    @Named("userListToStringList") 
    public static List<String> userListToStringList(List<User> users) { 
        // Converto la lista di user in lista di id
        List<String> userIds = users.stream()
            .map(user -> user.getNickname())
            .collect(Collectors.toList());

        return userIds;
    }
}

