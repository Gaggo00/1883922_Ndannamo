package com.example.chat.controller;

import com.example.chat.service.UserPresenceService;
import com.example.chat.dto.StatusNotice;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.util.Set;
import java.security.Principal;
import java.util.List;

@Controller
public class PresenceWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserPresenceService userPresenceService;

    public PresenceWebSocketController(SimpMessagingTemplate messagingTemplate, UserPresenceService userPresenceService) {
        this.messagingTemplate = messagingTemplate;
        this.userPresenceService = userPresenceService;
    }

    @MessageMapping("/presence/heartbeat")
    public void userHeartbeat(@AuthenticationPrincipal Principal principal) {
        String userId = principal.getName();

        Set<String> usersOnline = userPresenceService.getActiveUsers();
        if (!usersOnline.contains(userId))
            messagingTemplate.convertAndSend("/topic/notice/" + userId + "/status", new StatusNotice(userId, true)); // Online
        
        // Aggiorna la presenza dell'utente
        userPresenceService.userHeartbeat(userId);
    }

    @Scheduled(fixedRate = 10000)  // Ogni 10 secondi
    public void checkUserPresence() {
        // Rimuovi gli utenti inattivi dalla lista
        List<String> offlineUsers = userPresenceService.removeInactiveUsers();

        // Invia le notifiche di stato offline per gli utenti rimossi
        for (String userId : offlineUsers) {
            messagingTemplate.convertAndSend("/topic/notice/" + userId + "/status", new StatusNotice(userId, false));  // Offline
        }
    }
}
