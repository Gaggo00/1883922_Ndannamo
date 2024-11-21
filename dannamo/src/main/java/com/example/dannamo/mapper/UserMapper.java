package com.example.dannamo.mapper;

import com.example.dannamo.dto.UserDTO;
import com.example.dannamo.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Map User entity to UserDTO (senza mappare i viaggi)
    @Mapping(target = "trips", ignore = true) // Ignora i viaggi per evitare cicli
    UserDTO toDTO(User user);

    // Map UserDTO to User entity
    @Mapping(target = "trips", ignore = true)    // Ignora la lista dei viaggi
    @Mapping(target = "password", ignore = true) // Ignora il campo password
    @Mapping(target = "role", ignore = true)     // Ignora il ruolo
    User toEntity(UserDTO userDTO);
}
