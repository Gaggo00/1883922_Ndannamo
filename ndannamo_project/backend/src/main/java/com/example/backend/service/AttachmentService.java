package com.example.backend.service;


import com.example.backend.model.Attachment;
import com.example.backend.repositories.AttachmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;

    public AttachmentService(AttachmentRepository attachmentRepository) {
        this.attachmentRepository = attachmentRepository;
    }

    public List<Attachment> createAttachments(MultipartFile[] files) throws IOException {
        List<Attachment> attachments = new ArrayList<>();
        for (MultipartFile file : files) {
            Attachment attachment = Attachment.builder()
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .fileData(file.getBytes())
                    .build();

            attachments.add(attachment);
        }
        return attachmentRepository.saveAll(attachments);
    }

    public Attachment getAttachment(Long id) {
        return attachmentRepository.findById(id).orElseThrow();
    }



}
