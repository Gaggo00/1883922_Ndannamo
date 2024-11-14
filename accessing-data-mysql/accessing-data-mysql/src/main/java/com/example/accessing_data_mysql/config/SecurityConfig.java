package com.example.accessing_data_mysql.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        return http
                .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/index","/custom-login", "/css/**", "/images/**", "/fonts/**").permitAll()
                    .anyRequest().authenticated()
                )
                .formLogin(form ->form
                    .loginPage("/custom-login")
                    .defaultSuccessUrl("/index", true)
                    .permitAll()
                )
                .build();
    }


}
