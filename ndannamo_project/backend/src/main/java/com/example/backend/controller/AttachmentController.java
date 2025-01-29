package com.example.backend.controller;

import com.example.backend.model.Attachment;
import com.example.backend.service.AttachmentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/attachments")
public class AttachmentController {

    private final AttachmentService attachmentService;

    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @PostMapping(value={"", "/"})
    public ResponseEntity<?> createAttachments(
            @RequestParam("files") MultipartFile[] files) {
        try {
            List<Long> attachmentIds = attachmentService.createAttachments(files).stream().map(Attachment::getId).toList();
            return ResponseEntity.ok(attachmentIds); // Ritorna gli ID degli attachments creati
        }
        catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ex.getMessage());
        }
    }

    @GetMapping(value={"/{id}", "/{id}/"})
    public ResponseEntity<?> downloadFile(@PathVariable Long id) {
        try {
            Attachment file = attachmentService.getAttachment(id);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFileName() + "\"")
                    .body(file);
        }
        catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(ex.getMessage());
        }

    }





}
