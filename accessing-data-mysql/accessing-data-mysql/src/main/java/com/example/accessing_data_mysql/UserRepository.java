package com.example.accessing_data_mysql;

import org.springframework.data.repository.CrudRepository;
import com.example.accessing_data_mysql.User;

public interface UserRepository extends CrudRepository<User, Integer> {
}
