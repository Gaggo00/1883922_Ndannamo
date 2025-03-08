package com.example.backend.controller;

import com.example.backend.dto.AttachmentSimpleDTO;
import com.example.backend.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/attachable")
public class AttachableController {


    private final EventService eventService;

    public AttachableController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/{attachedToId}/attachments")
    public ResponseEntity<?> getAttachments(@PathVariable Long attachedToId) {
        List<AttachmentSimpleDTO> attachments = eventService.getAttachments(attachedToId);
        return ResponseEntity.ok(attachments);
    }

    @PostMapping("/{attachedToId}/attachments/{attachmentId}")
    public ResponseEntity<?> addAttachment(@PathVariable Long attachedToId, @PathVariable Long attachmentId) {
        eventService.addAttachmentToEvent(attachedToId, attachmentId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{attachedToId}/attachments")
    public ResponseEntity<?> addAttachments(@PathVariable Long attachedToId, @RequestBody List<Long> attachmentIds) {
        eventService.addAttachmentToEvent(attachedToId, attachmentIds);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{attachedToId}/attachments/{attachmentId}")
    public ResponseEntity<?> unlinkAttachment(@PathVariable Long attachedToId, @PathVariable Long attachmentId) {
        eventService.unlinkAttachmentFromEvent(attachedToId, attachmentId);
        return ResponseEntity.ok().build();
    }


}

