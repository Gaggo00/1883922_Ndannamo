package com.example.backend.controller;


import com.example.backend.dto.AttachmentDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.Attachment;
import com.example.backend.model.Trip;
import com.example.backend.service.AttachmentService;
import com.example.backend.service.TripService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    @GetMapping(value={"/{id}", "/{id}/"})
    public ResponseEntity<?> getAttachment(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            AttachmentDTO file = attachmentService.getAttachmentDataDTObyId(id, email);
            return ResponseEntity.ok()
                    .body(file);
        }
        catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ex.getMessage());
        }

    }

    @GetMapping(value={"/{id}/photo", "/{id}/photo/"})
    public ResponseEntity<?> getAttachmentPhoto(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            // Controllo che l'utente loggato faccia parte della trip

            AttachmentDTO file = attachmentService.getAttachmentDataDTObyId(id, email);
            return ResponseEntity.ok()
                    .contentType(MediaType.valueOf("image/png"))
                    .body(file.getFileData());
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
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            final String email = authentication.getName();
            attachmentService.deleteAttachment(id, email);
            return ResponseEntity.ok().build();
        }
        catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ex.getMessage());
        }
    }


}
