package com.example.chat.config;

import com.example.chat.service.JwtBToBService;
import com.example.chat.service.JwtService;
import com.example.chat.repositories.UserRepository;

import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final JwtBToBService jwtBToBService;

    public SecurityConfig(UserRepository userRepository, JwtService jwtService, JwtBToBService jwtBToBService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.jwtBToBService = jwtBToBService;
    }

    @Bean("standardUserDetailsService")
    public UserDetailsService userDetailsService() {
        return email -> (UserDetails) userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    @Bean("b2bUserDetailsService")
    public UserDetailsService b2bUserDetailsService() {
        return username -> {
            if ("backend".equals(username) || "authentication".equals(username)) {
                return org.springframework.security.core.userdetails.User
                        .withUsername(username)
                        .password("") // no password required
                        .authorities(Collections.emptyList())
                        .build();
            }
            throw new UsernameNotFoundException("B2B user not found");
        };
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtService, userDetailsService());
    }

    @Bean
    public JwtBToBAuthenticationFilter jwtBToBAuthenticationFilter() {
        JwtBToBAuthenticationFilter filter = new JwtBToBAuthenticationFilter(jwtBToBService, b2bUserDetailsService());
        filter.setRequestMatcher(
            new OrRequestMatcher(
                new AntPathRequestMatcher("/api/channels/**"),
                new AntPathRequestMatcher("/api/users/**")
            )
        );
        return filter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/ws/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtBToBAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}


