package com.example.backend.controller;

import com.example.backend.model.ChatMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class ChatController {

    // Gestire la ricezione dei messaggi WebSocket
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(ChatMessage chatMessage) {
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }

    // Endpoint HTTP per trattare richieste POST
    @PostMapping("/chat/{id}/{token}/xhr")
    public ResponseEntity<ChatMessage> handleHttpRequest(
            @PathVariable String id,
            @PathVariable String token,
            @RequestBody ChatMessage chatMessage
    ) {
        System.out.println("Chat ID: " + id);
        System.out.println("Token: " + token);
        System.out.println("Message: " + chatMessage.getContent());

        return ResponseEntity.ok(chatMessage);
    }
}
