package com.example.backend;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

import javax.sql.DataSource;


@Configuration
@EntityScan(basePackages = "com.example.backend.citiesDb.model")
@ComponentScan(basePackages = { "com.example.backend.citiesDb.*" })
@EnableJpaRepositories(
        basePackages = {"com.example.backend.citiesDb.repositories"},
        entityManagerFactoryRef = "secondaryEntityManagerFactory"
)
public class CitiesDbConfig {

    @Bean(name="citiesDb")
    @ConfigurationProperties("spring.citiesdb.datasource")
    public DataSource mainDbDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name="secondaryEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean getEntityManagerBean(
      @Qualifier("citiesDb") DataSource dataSource,
      EntityManagerFactoryBuilder builder) {
        return builder
          .dataSource(dataSource)
          .packages("com.example.backend.citiesDb.model")
          .build();
    }
}