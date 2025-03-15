package com.example.backend.mapper;

import com.example.backend.dto.TripDTO;
import com.example.backend.model.City;
import com.example.backend.model.Trip;
import com.example.backend.model.User;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", uses = UserMapperSimple.class)
public interface TripMapper {

    // Map Trip entity to TripDTO (mappa i partecipanti senza cicli)
    @Mapping(target = "createdBy", source = "created_by.id") // Mappa solo l'ID del creatore
    @Mapping(target = "createdByName", source = "created_by.nickname") // Mappa solo l'ID del creatore
    @Mapping(target = "list_participants", source = "participants")
    @Mapping(target = "creator", ignore = true)
    @Mapping(target = "locations", source = "locations", qualifiedByName = "mapCityListToStringList")
    @Mapping(target = "list_invitations", source ="invitations")
    TripDTO toDTO(Trip trip);

    // Map TripDTO to Trip entity (ignora i dettagli complessi)
    @Mapping(target = "participants", ignore = true)            // Ignora i partecipanti
    @Mapping(target = "invitations", ignore =true)
    @Mapping(target = "created_by.id", source = "createdBy")    // Mappa l'ID del creatore verso l'entità User
    @Mapping(target = "expenses", ignore = true)                // Ignora le spese
    @Mapping(target = "schedule", ignore = true)
    @Mapping(target = "locations", ignore = true)
    @Mapping(target = "attachments", ignore = true)
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
    @Named("userListToStringIDList") 
    public static List<String[]> userListToStringIDList(List<User> users) { 
        List<String[]> userIds = users.stream()
            .map(user -> new String[]{String.valueOf(user.getId()), user.getNickname()})
            .collect(Collectors.toList());
        
        return userIds;
    }

    // Metodo per mappare una singola City in una String
    default String mapCityToString(City city) {
        if (city == null) {
            return null;
        }
        return city.getName() + ", " + city.getCountry(); // Estrai il nome della città
    }

    // Metodo per mappare una lista di City in una lista di String
    @Named("mapCityListToStringList")
    default List<String> mapCityListToStringList(List<City> cities) {
        if (cities == null) {
            return null;
        }
        return cities.stream()
                .map(this::mapCityToString) // Usa il metodo di mapping per ogni elemento
                .toList();
    }
}

