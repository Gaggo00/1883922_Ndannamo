package com.example.chat.controller;

import com.example.chat.model.ApiResponse;
import com.example.chat.model.Channel;
import com.example.chat.service.ChannelService;
import com.example.chat.dto.CreateChannelRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;

import java.util.Optional;

@RestController
@RequestMapping("/api/channels")
public class ChannelController {

    private final ChannelService channelService;

    public ChannelController(ChannelService channelService) {
        this.channelService = channelService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getChannel(@PathVariable Long id) {
        try {
            Optional<Channel> channel = channelService.getChannel(id);
            return ResponseEntity.ok(channel);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
        }
    }
    

    @PostMapping(value={"/", ""})
    public ResponseEntity<?> createChannel(@Valid @RequestBody CreateChannelRequest request) {
        try {
            Channel createdChannel = channelService.createChannel(
                request.getChannelId(),
                request.getParticipants()
            );
            System.out.println("Il canale creato " + request.getChannelId());
            return ResponseEntity.ok(createdChannel);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
        }
    }

    @PostMapping(value={"/{id}", "{id}"})
    public ResponseEntity<?> checkCreateChannel(@PathVariable Long id, @Valid @RequestBody CreateChannelRequest request) {
        try {
            ApiResponse createdChannel = channelService.checkAndCreateChannel(
                id,
                request.getParticipants()
            );
            return ResponseEntity.ok(createdChannel);
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
        }
    }

    // Elimina un canale
    @DeleteMapping(value={"/{id}", "/{id}/"})
    public ResponseEntity<?> deleteChannel(@PathVariable Long id) {
        try {
            channelService.deleteChannel(id);
            return ResponseEntity.ok().body("Done");
        }
        catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
        }
    }

    // Rimuovi persone da un canale
    @DeleteMapping(value={"/{id}/participants", "/{id}/participants/"})
    public ResponseEntity<?> removeParticipant(@PathVariable Long id, @Valid @RequestBody String participant) {

        try {
            String res = channelService.removeParticipant(id, participant);
            return ResponseEntity.ok().body("Participants removed, res = " + res);
        }
        catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ex.getMessage());
        }
    }

    @PostMapping(value={"/{id}/participants", "/{id}/participants/"})
    public ResponseEntity<?> addParticipant(@PathVariable Long id, @Valid @RequestBody String participant) {

        try {
            String res = channelService.addParticipant(id, participant);
            return ResponseEntity.ok().body("Participants added, res = " + res);
        }
        catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ex.getMessage());
        }
    }
}
