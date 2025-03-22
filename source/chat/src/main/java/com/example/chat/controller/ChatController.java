package com.example.chat.controller;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.chat.model.ChatMessage;
import com.example.chat.service.ChannelService;
import com.example.chat.service.UserPresenceService;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChannelService channelService;
    private final UserPresenceService userPresenceService;

    public ChatController(ChannelService channelService, UserPresenceService userPresenceService) {
        this.channelService = channelService;
        this.userPresenceService = userPresenceService;
    }

    @GetMapping("/{channelId}")
    public ResponseEntity<?> getChatMessages(@PathVariable Long channelId) {

        try {

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            List<ChatMessage> messages = channelService.getMessagesByChannelId(channelId, email);

            return ResponseEntity.ok(messages);

        } catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(ex.getMessage());
        }
    }

    @GetMapping("/{channelId}/presence")
    public ResponseEntity<?> getOnlineUsers(@PathVariable Long channelId) {
        try {

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // 1. Recupera i partecipanti della trip
            List<String> participants = channelService.getChannelParticipants(channelId);
            if (!participants.contains(email))
                return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("L'utente non è nel canale");

            // 2. Recupera l'insieme degli utenti attivi (online)
            Set<String> activeUsers = userPresenceService.getActiveUsers();

            // 3. Filtra i partecipanti che sono anche online (userId deve combaciare)
            List<String> onlineParticipants = participants.stream()
                .filter(activeUsers::contains)
                .collect(Collectors.toList());

            return ResponseEntity.ok(onlineParticipants);

        } catch (Exception ex) {
            return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(ex.getMessage());
        }
    }

}
