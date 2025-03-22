package com.example.backend.dto;

import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CreateChannelRequest {

    @NotNull(message = "Channel ID is required")  // La validazione per il Channel ID
    private Long channelId;

    @NotNull(message = "Participants list is required")  // La validazione per la lista dei partecipanti
    @Size(min = 1, message = "There must be at least one participant")  // La validazione per avere almeno un partecipante
    private List<String> participants;

    public CreateChannelRequest(Long channelId, List<String> participants) {
        this.channelId = channelId;
        this.participants = participants;
    }

    // Getters e Setters
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
