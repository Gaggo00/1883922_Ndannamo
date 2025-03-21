package com.example.chat.controller;

import com.example.chat.model.ChatMessage;
import com.example.chat.repositories.ChatMessageRepository;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
public class MessageController {

    private final ChatMessageRepository chatMessageRepository;

    public MessageController(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    @MessageMapping("/hello") // frontend manda su /app/hello
    @SendTo("/topic/greetings")
    public String greeting(String message) {
        return "Hello, " + message + "!";
    }

    @MessageMapping("/chat/{tripId}")  // Riceve messaggi da /chat/{tripId}
    @SendTo("/topic/messages/{tripId}")  // Invia messaggi a tutti gli utenti connessi
    public ChatMessage sendMessage(@DestinationVariable String tripId, ChatMessage message, @AuthenticationPrincipal Principal principal) {

        String username = principal.getName();
        System.out.println(username);

        message.setChannelId(Long.parseLong(tripId)); // Converte tripId da String a Long
        //message.setDate(LocalDateTime.now()); // Assegna data e ora attuali
        chatMessageRepository.save(message);

        return message;
    }
}
