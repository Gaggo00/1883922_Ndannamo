package com.example.backend.controller;


import com.example.backend.dto.AttachmentDTO;
import com.example.backend.model.Attachment;
import com.example.backend.service.AttachmentService;
import com.example.backend.service.TripService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/attachments")
public class AttachmentController {

    private final AttachmentService attachmentService;
    private final TripService tripService;

    public AttachmentController(AttachmentService attachmentService, TripService tripService) {
        this.attachmentService = attachmentService;
        this.tripService = tripService;
    }

    @PostMapping(value={"", "/trip/{tripId}"})
    public ResponseEntity<?> createAttachments(
            @RequestParam("files") MultipartFile[] files, @PathVariable Long tripId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            Trip trip = tripService.getTripById(tripId);
            List<Long> attachmentIds = attachmentService.createAttachments(files, email, trip).stream().map(Attachment::getId).toList();
            return ResponseEntity.ok(attachmentIds); // Ritorna gli ID degli attachments creati
        }
        catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ex.getMessage());
        }
    }

    @GetMapping(value={"/{id}", "/{id}/"})
    public ResponseEntity<?> getAttachment(@PathVariable Long id) {
        try {
            AttachmentDTO file = attachmentService.getAttachmentDataDTObyId(id);
            return ResponseEntity.ok()
                    .body(file);
        }
        catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ex.getMessage());
        }

    }

    @DeleteMapping(value={"/{id}", "/{id}/"})
    public ResponseEntity<?> deleteAttachment(@PathVariable Long id) {
        try {
            attachmentService.deleteAttachment(id);
            return ResponseEntity.ok().build();
        }
        catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ex.getMessage());
        }
    }





}
