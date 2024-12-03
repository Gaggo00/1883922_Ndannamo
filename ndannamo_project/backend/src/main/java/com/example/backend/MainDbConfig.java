package com.example.backend;

import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.HashMap;



@Configuration
@EntityScan(basePackages = "com.example.backend.mainDb.model")
@ComponentScan(basePackages = { "com.example.backend.mainDb.*" })
@EnableJpaRepositories(
        basePackages = {"com.example.backend.mainDb.repositories"},
        entityManagerFactoryRef = "primaryEntityManagerFactory"
)
public class MainDbConfig {

    @Bean(name="mainDb")
    @Primary
    @ConfigurationProperties("spring.maindb.datasource")
    public DataSource mainDbDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name="primaryEntityManagerFactory")
    @Primary
    public LocalContainerEntityManagerFactoryBean getEntityManagerBean(
      @Qualifier("mainDb") DataSource dataSource,
      EntityManagerFactoryBuilder builder) {
        return builder
          .dataSource(dataSource)
          .packages("com.example.backend.mainDb.model")
          .build();
    }
}


/*
@Configuration
@EntityScan(basePackages = "com.example.backend.mainDb.model")
//@ComponentScan(basePackages = { "com.example.backend.mainDb.*" })
@EnableJpaRepositories(
        basePackages = {"com.example.backend.mainDb.repositories"},
        //transactionManagerRef = "primaryTransactionManager",
        entityManagerFactoryRef = "primaryEntityManagerFactory"
)
@Profile("!test")
public class MainDbConfig {

    @Bean(name="mainDb")
    @Primary
    @ConfigurationProperties(prefix = "spring.maindb.datasource")
    public DataSource dataSource(){
        return DataSourceBuilder.create().build();
    }

    
    @Bean("primaryEntityManagerFactory")
    @Primary
    public LocalContainerEntityManagerFactoryBean getEntityManagerBean(EntityManagerFactoryBuilder builder, @Qualifier("mainDb") DataSource dataSource){
        //HashMap<String,String> prop = new HashMap<>();
        //prop.put("hibernate.dialect","org.hibernate.dialect.PostgreSQLDialect");
        return builder.dataSource(dataSource)
                //.properties(prop)
                .packages("com.example.backend.mainDb.model").build();
    }
    

    /*
    @Bean("primaryTransactionManager")
    public PlatformTransactionManager getTransactionManager(@Qualifier("primaryEntityManagerFactory") EntityManagerFactory factory){
        return new JpaTransactionManager(factory);
    }
    */
//}
