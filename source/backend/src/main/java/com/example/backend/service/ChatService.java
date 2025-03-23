package com.example.backend.service;

import java.util.List;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.backend.dto.CreateChannelRequest;

@Service
public class ChatService {

    private final RestTemplate restTemplate;
    private final String CHAT_SERVER_URL = "http://chat:8082/api/channels/";
    private final JwtService jwtService;

    public ChatService(RestTemplate restTemplate, JwtService jwtService) {
        this.restTemplate = restTemplate;
        this.jwtService = jwtService;
    }

    public ResponseEntity<?> createChannel(String email, Long tripId) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + jwtService.getCurrentJwt());

        List<String> participants = List.of(email);
        CreateChannelRequest request = new CreateChannelRequest(tripId, participants);
        HttpEntity<CreateChannelRequest> requestEntity = new HttpEntity<CreateChannelRequest>(request, headers);

        ResponseEntity<?> response = restTemplate.exchange(
            CHAT_SERVER_URL,
            HttpMethod.POST,
            requestEntity,
            String.class
        );

        return response;  
    }

    public ResponseEntity<?> checkCreateChannel(List<String> participants, Long tripId) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + jwtService.getCurrentJwt());

        CreateChannelRequest request = new CreateChannelRequest(tripId, participants);
        HttpEntity<CreateChannelRequest> requestEntity = new HttpEntity<CreateChannelRequest>(request, headers);
        
        String url = UriComponentsBuilder.fromHttpUrl(CHAT_SERVER_URL)
            .path("/{tripId}")
            .buildAndExpand(tripId) // sostituisce {tripId} con il valore reale
            .toUriString();

        ResponseEntity<?> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            requestEntity,
            String.class
        );

        return response;  
    }

    public ResponseEntity<?> deleteChannel(Long tripId) {

        String url = UriComponentsBuilder
            .fromHttpUrl(CHAT_SERVER_URL)
            .pathSegment(tripId.toString())
            .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + jwtService.getCurrentJwt());

        HttpEntity<?> entity = new HttpEntity<>(headers);

        ResponseEntity<?> response = restTemplate.exchange(
            url,
            HttpMethod.DELETE,
            entity,
            String.class
        );

        return response;  
    }

    public ResponseEntity<?> addParticipant(String email, Long channelId) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + jwtService.getCurrentJwt());
        HttpEntity<String> requestEntity = new HttpEntity<String>(email, headers);

        String url = UriComponentsBuilder
            .fromHttpUrl(CHAT_SERVER_URL)
            .pathSegment(channelId.toString(), "participants")
            .toUriString();

        ResponseEntity<?> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            requestEntity,
            String.class
        );

        return response;
    }

    public ResponseEntity<?> removeParticipant(String email, Long channelId) {

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + jwtService.getCurrentJwt());
        HttpEntity<String> requestEntity = new HttpEntity<String>(email, headers);

        String url = UriComponentsBuilder
            .fromHttpUrl(CHAT_SERVER_URL)
            .pathSegment(channelId.toString(), "participants")
            .toUriString();

        ResponseEntity<?> response = restTemplate.exchange(
            url,
            HttpMethod.DELETE,
            requestEntity,
            String.class
        );

        return response;
    }
}
