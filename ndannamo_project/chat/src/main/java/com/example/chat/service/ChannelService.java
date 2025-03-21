package com.example.chat.service;

import com.example.chat.model.ApiResponse;
import com.example.chat.model.Channel;
import com.example.chat.model.ChatMessage;
import com.example.chat.repositories.ChannelRepository;
import com.example.chat.repositories.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ChannelService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChannelRepository channelRepository;

    public ChannelService(ChannelRepository channelRepository, ChatMessageRepository chatMessageRepository) {
        this.channelRepository = channelRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    public Optional<Channel> getChannel(Long id) {
        Optional<Channel> channel = channelRepository.findByChannelId(id);
        return channel;
    }

    // Crea un canale
    public Channel createChannel(Long id, List<String> participants) {
        Optional<Channel> oldChannel = channelRepository.findByChannelId(id);
        if (oldChannel.isPresent())
            throw new IllegalArgumentException("Canale gia esistente");

        Channel channel = new Channel(id, participants);
        return channelRepository.save(channel);
    }

    // Elimina un canale
    public void deleteChannel(Long id) {
        Optional<Channel> oldChannel = channelRepository.findByChannelId(id);

        Channel existingChannel = oldChannel.orElseThrow(() ->
            new IllegalArgumentException("Channel non esistente")
        );

        channelRepository.delete(existingChannel);
    }


    public ApiResponse checkAndCreateChannel(Long id, List<String> participants) {
        Optional<Channel> existingChannelOpt = channelRepository.findByChannelId(id);

        if (existingChannelOpt.isEmpty()) {
            // 1) Non esiste → lo creo
            Channel newChannel = new Channel(id, participants);
            channelRepository.save(newChannel);

            return new ApiResponse(true, "Nuovo canale creato", newChannel);
        }

        Channel existingChannel = existingChannelOpt.get();

        // 2) Esiste → confronto i partecipanti
        Set<String> currentParticipants = new HashSet<>(existingChannel.getParticipants());
        Set<String> newParticipants = new HashSet<>(participants);

        if (!currentParticipants.equals(newParticipants)) {
            // 2a) Diversi → aggiorno
            existingChannel.setParticipants(participants);
            channelRepository.save(existingChannel);

            return new ApiResponse(true, "Partecipanti aggiornati", existingChannel);
        }

        // 3) Uguali → ritorno OK senza fare nulla
        return new ApiResponse(true, "Canale già aggiornato", existingChannel);
    }



    // Aggiunge un partecipante
    public String addParticipant(Long id, String participant) {

        Optional<Channel> channel = channelRepository.findByChannelId(id);
        Channel existingChannel = channel.orElseThrow(() ->
            new IllegalArgumentException("Channel non esistente")
        );

        // Verifica se il partecipante è già presente
        if (existingChannel.getParticipants().contains(participant)) {
            throw new IllegalArgumentException("Il partecipante è già presente");
        }

        // Aggiungi il partecipante alla lista
        existingChannel.getParticipants().add(participant);

        // Salva il canale aggiornato
        channelRepository.save(existingChannel);

        return "Aggiunto";
    }

    // Rimuove dei partecipanti
    public String removeParticipant(Long id, String participant) {

        Optional<Channel> channel = channelRepository.findByChannelId(id);
        Channel existingChannel = channel.orElseThrow(() ->
            new IllegalArgumentException("Channel non esistente")
        );

        // Verifica se il partecipante è presente
        if (!existingChannel.getParticipants().contains(participant)) {
            throw new IllegalArgumentException("Il partecipante non è presente");
        }

        // Rimuovi il partecipante dalla lista
        existingChannel.getParticipants().remove(participant);

        // Salva il canale aggiornato
        channelRepository.save(existingChannel);

        return "Eliminato";
    }


    // Ritorna una lista dei partecipanti ad un canale
    public List<String> getChannelParticipants(Long id) {

        Optional<Channel> channel = channelRepository.findByChannelId(id);
        Channel existingChannel = channel.orElseThrow(() ->
            new IllegalArgumentException("Channel non esistente")
        );

        return existingChannel.getParticipants();
    }

    public List<ChatMessage> getMessagesByChannelId(Long channelId, String user) {

        Optional<Channel> channel = channelRepository.findByChannelId(channelId);
        Channel existingChannel = channel.orElseThrow(() ->
            new IllegalArgumentException("Channel non esistente")
        );

        List<String> participants = existingChannel.getParticipants();
        if (!participants.contains(user)) {
            throw new IllegalCallerException("L'utente non è nel canale");
        }

        return chatMessageRepository.findByChannelId(channelId);

    }

}
