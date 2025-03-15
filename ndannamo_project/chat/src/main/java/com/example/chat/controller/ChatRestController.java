package com.example.chat.controller;

import com.example.chat.model.ChatMessage;
import com.example.chat.repositories.ChatMessageRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

    private final ChatMessageRepository chatMessageRepository;

    public ChatRestController(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    @GetMapping("/{tripId}")
    public List<ChatMessage> getChatMessages(@PathVariable Long tripId) {
        return chatMessageRepository.findByTripId(tripId);
    }
}
