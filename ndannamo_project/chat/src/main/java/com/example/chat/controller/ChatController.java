package com.example.chat.controller;

import com.example.chat.model.ChatMessage;
import com.example.chat.repositories.ChatMessageRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import java.time.LocalDateTime;

@Controller
public class ChatController {

    private final ChatMessageRepository chatMessageRepository;

    public ChatController(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    @MessageMapping("/chat/{tripId}")  // Riceve messaggi da /chat/{tripId}
    @SendTo("/topic/messages/{tripId}")  // Invia messaggi a tutti gli utenti connessi
    public ChatMessage sendMessage(@DestinationVariable String tripId, ChatMessage message) {

        message.setTripId(Long.parseLong(tripId)); // Converte tripId da String a Long
        //message.setDate(LocalDateTime.now()); // Assegna data e ora attuali
        chatMessageRepository.save(message);

        return message;
    }
}
