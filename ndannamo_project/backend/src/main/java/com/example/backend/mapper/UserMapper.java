package com.example.backend.mapper;

import com.example.backend.dto.UserDTO;
import com.example.backend.model.User;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = TripMapper.class)
public interface UserMapper {

    // Map User entity to UserDTO (senza mappare i viaggi)
    //@Mapping(target = "trips", ignore = true) // Ignora i viaggi per evitare cicli
    //@Mapping(target = "trips_created", ignore = true) // Ignora i viaggi per evitare cicli
    UserDTO toDTO(User user);

    // Map UserDTO to User entity
    @Mapping(target = "trips", ignore = true)    // Ignora la lista dei viaggi
    @Mapping(target = "trips_created", ignore = true)    // Ignora la lista dei viaggi
    @Mapping(target = "invitations", ignore = true)    // Ignora la lista dei viaggi
    @Mapping(target = "password", ignore = true) // Ignora il campo password
    @Mapping(target = "role", ignore = true)     // Ignora il ruolo
    User toEntity(UserDTO userDTO);
}
