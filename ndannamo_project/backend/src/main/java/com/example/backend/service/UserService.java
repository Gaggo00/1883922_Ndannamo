package com.example.backend.service;

import com.example.backend.dto.ChangePasswordRequest;
import com.example.backend.dto.UserDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Trip;
import com.example.backend.model.User;
import com.example.backend.repositories.UserRepository;
import com.example.backend.mapper.UserMapperImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapperImpl userMapper;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, UserMapperImpl userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    public UserDTO registerUser(User user) {
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already taken");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(User.Role.USER);
        return userMapper.toDTO(userRepository.save(user));
    }

    public UserDTO getUserDTOByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("User not found!"));
        UserDTO userDTO = userMapper.toDTO(user);
        return userDTO;
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("User not found!"));
    }

    public User getUserById(long id) {
        return userRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("User not found!"));
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
    protected void saveUser(User user) {
        userRepository.save(user);
    }
}
