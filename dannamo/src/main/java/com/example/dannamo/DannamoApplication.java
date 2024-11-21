package com.example.dannamo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.example.dannamo.model")
@EnableJpaRepositories(basePackages = "com.example.dannamo.repositories")
public class DannamoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DannamoApplication.class, args);
	}

}
