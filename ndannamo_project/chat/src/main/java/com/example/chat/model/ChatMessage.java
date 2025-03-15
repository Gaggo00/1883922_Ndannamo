package com.example.chat.model;

import jakarta.persistence.*;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long tripId;
    private Long senderId;
    private String nickname;
    private String body;
    private String date;

    // Costruttori
    public ChatMessage() {}

    public ChatMessage(Long tripId, Long senderId, String nickname, String body, String date) {
        this.tripId = tripId;
        this.senderId = senderId;
        this.nickname = nickname;
        this.body = body;
        this.date = date;
    }

    // Getter e Setter
    public Long getId() { return id; }
    public Long getTripId() { return tripId; }
    public Long getSenderId() { return senderId; }
    public String getNickname() { return nickname; }
    public String getBody() { return body; }
    public String getDate() { return date; }

    public void setTripId(Long tripId) { this.tripId = tripId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public void setBody(String body) { this.body = body; }
    public void setDate(String date) { this.date = date; }
}
