package com.example.chat.service;

import com.example.chat.model.User;
import com.example.chat.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getUser(String id) {
        Optional<User> User = userRepository.findByEmail(id);
        return User;
    }

    // Crea un user
    public User createUser(String id) {
        Optional<User> existingUser = userRepository.findByEmail(id);

        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("User già esistente");
        }

        User user = new User(id);
        return userRepository.save(user);
    }

    // Se l'user già esiste non succede nulla
    public User createUserIfNotExists(String email) {
    return userRepository.findByEmail(email)
            .orElseGet(() -> {
                User newUser = new User(email);
                return userRepository.save(newUser);
            });
    }


    // Elimina un user
    public void deleteUser(String id) {
        Optional<User> user = userRepository.findByEmail(id);

        User existingUser = user.orElseThrow(() ->
            new IllegalArgumentException("User non esistente")
        );

        userRepository.delete(existingUser);
    }

}