package com.example.chat.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;  // Utilizzo di LocalDateTime per le date

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long channelId;
    private Long senderId;
    private String nickname;
    private String body;
    
    @Column(name = "message_date")  // Specifico il nome della colonna per chiarezza
    private LocalDateTime date;  // Uso LocalDateTime per rappresentare la data e l'ora

    // Costruttori
    public ChatMessage() {}

    public ChatMessage(Long channelId, Long senderId, String nickname, String body, LocalDateTime date) {
        this.channelId = channelId;
        this.senderId = senderId;
        this.nickname = nickname;
        this.body = body;
        this.date = date;
    }

    // Getter e Setter
    public Long getId() { return id; }
    public Long getChannelId() { return channelId; }
    public Long getSenderId() { return senderId; }
    public String getNickname() { return nickname; }
    public String getBody() { return body; }
    public LocalDateTime getDate() { return date; }

    public void setChannelId(Long channelId) { this.channelId = channelId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public void setBody(String body) { this.body = body; }
    public void setDate(LocalDateTime date) { this.date = date; }
}
