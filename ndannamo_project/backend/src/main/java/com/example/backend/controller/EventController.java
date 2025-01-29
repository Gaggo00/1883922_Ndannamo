package com.example.backend.controller;

import com.example.backend.dto.AttachmentDTO;
import com.example.backend.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/events")
public class EventController {


    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/{eventId}/attachments")
    public ResponseEntity<?> getAttachments(@PathVariable Long eventId) {
        List<AttachmentDTO> attachments = eventService.getAttachments(eventId);
        return ResponseEntity.ok(attachments);
    }

    @PostMapping("/{eventId}/attachments/{attachmentId}")
    public ResponseEntity<?> addAttachment(@PathVariable Long eventId, @PathVariable Long attachmentId) {
        eventService.addAttachmentToEvent(eventId, attachmentId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{eventId}/attachments")
    public ResponseEntity<?> addAttachments(@PathVariable Long eventId, @RequestBody List<Long> attachmentIds) {
        eventService.addAttachmentToEvent(eventId, attachmentIds);
        return ResponseEntity.ok().build();
    }


}

