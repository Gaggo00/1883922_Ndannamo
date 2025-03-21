package com.example.backend.service;

import java.util.List;

import org.springframework.http.HttpEntity;
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

    public ChatService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ResponseEntity<?> createChannel(String email, Long tripId) {

        List<String> participants = List.of(email);
        CreateChannelRequest request = new CreateChannelRequest(tripId, participants);
        HttpEntity<CreateChannelRequest> requestEntity = new HttpEntity<CreateChannelRequest>(request);

        ResponseEntity<?> response = restTemplate.exchange(
            CHAT_SERVER_URL,
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

        ResponseEntity<?> response = restTemplate.exchange(
            url,
            HttpMethod.DELETE,
            null,
            String.class
        );

        return response;  
    }

    public ResponseEntity<?> addParticipant(String email, Long channelId) {

        HttpEntity<String> requestEntity = new HttpEntity<String>(email);

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

        HttpEntity<String> requestEntity = new HttpEntity<String>(email);

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
