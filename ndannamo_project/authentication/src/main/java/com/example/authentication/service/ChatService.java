package com.example.authentication.service;

import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class ChatService {

    private final RestTemplate restTemplate;
    private final String CHAT_SERVER_URL = "http://chat:8082/api/users/";

    public ChatService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ResponseEntity<?> createUser(String email) {

        String url = UriComponentsBuilder
            .fromHttpUrl(CHAT_SERVER_URL)
            .pathSegment(email)
            .toUriString();
        
        System.out.println("L'url è: " + url);

        ResponseEntity<?> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            null,
            String.class
        );

        return response;  
    }
}
