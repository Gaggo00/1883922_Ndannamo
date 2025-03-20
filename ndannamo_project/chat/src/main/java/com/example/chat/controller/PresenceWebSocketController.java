package com.example.chat.controller;

import com.example.chat.service.UserPresenceService;
import com.example.chat.dto.StatusNotice;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.util.Set;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import java.util.List;

@Controller
@EnableScheduling
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

        System.out.println("STIAMO NEL BATTITO " + userId);
        Set<String> usersOnline = userPresenceService.getActiveUsers();
        if (!usersOnline.contains(userId)) {
            String encodedEmail = customEncodeEmail(userId);
            System.out.println(encodedEmail);
            messagingTemplate.convertAndSend("/topic/notice/" + encodedEmail + "/status", new StatusNotice(userId, true));
        }
        
        // Aggiorna la presenza dell'utente
        userPresenceService.userHeartbeat(userId);
    }

    @Scheduled(fixedRate = 10000)  // Ogni 10 secondi
    public void checkUserPresence() {
        // Rimuovi gli utenti inattivi dalla lista
        System.out.println("Non stiamo nel BATTITO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        List<String> offlineUsers = userPresenceService.removeInactiveUsers();

        // Invia le notifiche di stato offline per gli utenti rimossi
        for (String userId : offlineUsers) {
            String encodedEmail = customEncodeEmail(userId);
            messagingTemplate.convertAndSend("/topic/notice/" + encodedEmail + "/status", new StatusNotice(userId, false));  // Offline
        }
    }

    public static String customEncodeEmail(String email) {
        return email.replace("@", "_at_").replace(".", "_dot_");
    }
}
