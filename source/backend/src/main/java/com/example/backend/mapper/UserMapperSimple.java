package com.example.backend.mapper;

import com.example.backend.dto.UserDTOSimple;
import com.example.backend.model.User;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapperSimple {

    // Map User entity to UserDTOSimple
    UserDTOSimple toDTO(User user);

    // Map UserDTO to User entity
    @Mapping(target = "trips", ignore = true)    // Ignora la lista dei viaggi
    @Mapping(target = "trips_created", ignore = true)    // Ignora la lista dei viaggi
    @Mapping(target = "invitations", ignore = true)    // Ignora la lista dei viaggi
    @Mapping(target = "password", ignore = true) // Ignora il campo password
    @Mapping(target = "role", ignore = true)     // Ignora il ruolo
    @Mapping(target = "authorities", ignore = true)
    User toEntity(UserDTOSimple userDTOSimple);
}
