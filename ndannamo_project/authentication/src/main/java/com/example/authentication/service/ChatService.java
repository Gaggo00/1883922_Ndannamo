package com.example.authentication.service;

import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;

@Service
public class ChatService {

    private final RestTemplate restTemplate;
    private final String CHAT_SERVER_URL = "http://chat:8082/api/users/";

    private final JwtService jwtService;

    public ChatService(RestTemplate restTemplate, JwtService jwtService) {
        this.restTemplate = restTemplate;
        this.jwtService = jwtService;
    }

    public ResponseEntity<?> createUser(String email) {

        String url = UriComponentsBuilder
            .fromHttpUrl(CHAT_SERVER_URL)
            .pathSegment(email)
            .toUriString();
        
        System.out.println("L'url è: " + url);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + jwtService.getCurrentJwt());

        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<?> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            String.class
        );

        return response;  
    }
}
