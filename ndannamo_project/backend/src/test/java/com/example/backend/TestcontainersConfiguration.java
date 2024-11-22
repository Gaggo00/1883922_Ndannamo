package com.example.backend;

import org.springframework.boot.test.context.TestConfiguration;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

@TestConfiguration
public class TestcontainersConfiguration {

	// Configurazione del container PostgreSQL
	static PostgreSQLContainer<?> postgresContainer = new PostgreSQLContainer<>(
			DockerImageName.parse("postgres:15.2") // Sostituisci con la versione desiderata di PostgreSQL
	);

	static {
		postgresContainer.start();
		System.setProperty("DB_URL", postgresContainer.getJdbcUrl());
		System.setProperty("DB_USERNAME", postgresContainer.getUsername());
		System.setProperty("DB_PASSWORD", postgresContainer.getPassword());
	}
}
