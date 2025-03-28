package com.example.backend.service;

import com.example.backend.dto.ChangePasswordRequest;
import com.example.backend.dto.TripDTO;
import com.example.backend.dto.UserDTO;
import com.example.backend.dto.UserDTOSimple;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.User;
import com.example.backend.repositories.UserRepository;
import com.example.backend.mapper.UserMapperImpl;
import com.example.backend.mapper.UserMapperSimple;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;


// FUNZIONALITA': cambio password, cambio nickname


@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapperImpl userMapper;
    private final UserMapperSimple userMapperSimple;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapperImpl userMapper, UserMapperSimple userMapperSimple) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.userMapperSimple = userMapperSimple;
    }

    public UserDTO getUserDTOById(Long id) {
        User user = getUserById(id);
        UserDTO userDTO = userMapper.toDTO(user);
        return userDTO;
    }

    public UserDTO getUserDTOByEmail(String email) {
        User user = getUserByEmail(email);
        UserDTO userDTO = userMapper.toDTO(user);
        for (TripDTO tripDTO : userDTO.getTrips()) {
            // se l'utente loggato e' il creatore
            if (userDTO.getId() == tripDTO.getCreatedBy()) {
                tripDTO.setCreator(true);
            }
        }
        return userDTO;
    }

    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("User not found!"));
    }

    public User getUserById(long id) {
        return userRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("User not found!"));
    }

    public List<UserDTOSimple> getAllUsers() {
        List<User> users = userRepository.findAll(); // Recupera tutti gli utenti dal DB
        return users.stream()
                .map(userMapperSimple::toDTO) // Converte ogni utente in UserDTOSimple
                .collect(Collectors.toList()); // Raccoglie i risultati in una lista
    }

    public Boolean userExists(String email) {
        return userRepository.existsByEmail(email);
    }

    
    // Cambio nickname
    public void changeNickname(String email, String newNickname) {
        User user = getUserByEmail(email);
        user.setNickname(newNickname);
        userRepository.save(user);
    }


    // Cambio password
    public void changePassword(String email, ChangePasswordRequest request){
        User user = getUserByEmail(email);
        if(!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())){
            throw new BadCredentialsException("Wrong password!");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }


    // per aggiornare gli utenti quando mandi inviti
    protected User saveUser(User user) {
        return userRepository.save(user);
    }


}
