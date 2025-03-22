package com.example.chat.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "channels")
public class Channel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long channelId;
    private List<String> participants = new ArrayList<>();

    // Costruttore senza argomenti
    public Channel() {}

    // Costruttore con argomenti
    public Channel(Long channelId, List<String> participants) {
        this.channelId = channelId;
        this.participants = participants;
    }

    // Getter e Setter
    public Long getId() {
        return id;
    }

    public Long getChannelId() {
        return channelId;
    }

    public void setChannelId(Long channelId) {
        this.channelId = channelId;
    }

    public List<String> getParticipants() {
        return participants;
    }

    public void setParticipants(List<String> participants) {
        this.participants = participants;
    }
}
