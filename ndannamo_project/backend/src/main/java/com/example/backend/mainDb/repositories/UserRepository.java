package com.example.backend.mainDb.repositories;

import com.example.backend.mainDb.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

//@Repository
public interface UserRepository extends JpaRepository<User,Long> {

    Optional<User> findByEmail(String email);


}
