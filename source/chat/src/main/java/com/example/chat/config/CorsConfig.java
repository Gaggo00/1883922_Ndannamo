package com.example.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // Per tutte le rotte
                .allowedOrigins("http://localhost:3000")  // Aggiungi il tuo dominio frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // Metodi permessi
                .allowedHeaders("*")  // Permetti tutte le intestazioni
                .allowCredentials(true);  // Permetti l'uso di cookie, se necessario
    }
}
