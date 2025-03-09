package com.example.backend.service;


import com.example.backend.dto.AttachmentDTO;
import com.example.backend.model.Attachment;
import com.example.backend.model.User;
import com.example.backend.repositories.AttachmentRepository;
import com.example.backend.repositories.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.backend.mapper.AttachmentMapperImpl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TripRepository tripRepository;
    private final AttachmentMapperImpl attachmentMapper;

    public AttachmentService(AttachmentRepository attachmentRepository, AttachmentMapperImpl attachmentMapper, TripRepository tripRepository) {
        this.attachmentRepository = attachmentRepository;
        this.attachmentMapper = attachmentMapper;
        this.tripRepository = tripRepository;
    }

    public List<Attachment> createAttachments(MultipartFile[] files, String email, Trip trip) throws IOException {
        List<Attachment> attachments = new ArrayList<>();
        User logged_user = userService.getUserByEmail(email);
        for (MultipartFile file : files) {
            Attachment attachment = Attachment.builder()
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .fileData(file.getBytes())
                    .uploadedBy(logged_user)
                    .trip(trip)
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
