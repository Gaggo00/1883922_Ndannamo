package com.example.backend.service;


import com.example.backend.dto.AttachmentDTO;
import com.example.backend.model.Attachment;
import com.example.backend.repositories.AttachmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.backend.mapper.AttachmentMapperImpl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final AttachmentMapperImpl attachmentMapper;

    public AttachmentService(AttachmentRepository attachmentRepository, AttachmentMapperImpl attachmentMapper) {
        this.attachmentRepository = attachmentRepository;
        this.attachmentMapper = attachmentMapper;
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

    public AttachmentDTO getAttachmentDataDTObyId(Long id) {
        Attachment attachment = getAttachment(id);
        return attachmentMapper.toDTO(attachment);
    }

    public void deleteAttachment(Long id) {
        attachmentRepository.deleteById(id);
    }



}
