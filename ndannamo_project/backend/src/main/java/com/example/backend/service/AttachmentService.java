package com.example.backend.service;


import com.example.backend.dto.AttachmentDTO;
import com.example.backend.dto.AttachmentSimpleDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.exception.UserNotParticipantException;
import com.example.backend.exception.UserNotParticipantException.UserNotParticipantExceptionCodes;
import com.example.backend.model.Attachment;
import com.example.backend.model.Trip;
import com.example.backend.model.User;
import com.example.backend.repositories.AttachmentRepository;
import com.example.backend.repositories.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.backend.mapper.AttachmentMapperImpl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TripRepository tripRepository;
    private final UserService userService;
    private final AttachmentMapperImpl attachmentMapper;

    public AttachmentService(AttachmentRepository attachmentRepository, AttachmentMapperImpl attachmentMapper, TripRepository tripRepository, UserService userService) {
        this.attachmentRepository = attachmentRepository;
        this.attachmentMapper = attachmentMapper;
        this.tripRepository = tripRepository;
        this.userService = userService;
    }

    public List<Attachment> createAttachments(MultipartFile[] files, String email, Trip trip) throws IOException {
        List<Attachment> attachments = new ArrayList<>();
        User logged_user = userService.getUserByEmail(email);
        if (!TripService.userIsAParticipant(logged_user, trip)) {
            throw new UserNotParticipantException(logged_user, UserNotParticipantExceptionCodes.CANT_UPLOAD);
        }
        for (MultipartFile file : files) {
            Attachment attachment = Attachment.builder()
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .fileData(file.getBytes())
                    .uploadedBy(logged_user)
                    .uploadDate(LocalDateTime.now())
                    .trip(trip)
                    .build();

            attachments.add(attachment);
        }
        attachmentRepository.saveAll(attachments);
        trip.addAttachments(attachments);
        tripRepository.save(trip);
        return attachments;
    }



    public Attachment getAttachment(Long id) {
        return attachmentRepository.findById(id).orElseThrow();
    }

    public AttachmentDTO getAttachmentDataDTObyId(Long id, String email) {
        Attachment attachment = getAttachment(id);
        User user = userService.getUserByEmail(email);
        if (!TripService.userIsAParticipant(user, attachment.getTrip())) {
            throw new UserNotParticipantException(user, UserNotParticipantExceptionCodes.CANT_RETRIEVE);
        }
        return attachmentMapper.toDTO(attachment);
    }

    public AttachmentSimpleDTO getAttachmentSimpleDTObyId(Long id, String email) {
        Attachment attachment = getAttachment(id);
        User user = userService.getUserByEmail(email);
        if (!TripService.userIsAParticipant(user, attachment.getTrip())) {
            throw new UserNotParticipantException(user, UserNotParticipantExceptionCodes.CANT_RETRIEVE);
        }
        return attachmentMapper.toSimpleDTO(attachment);
    }

    public void deleteAttachment(Long id, String email) {
        Attachment attachment = getAttachment(id);
        User user = userService.getUserByEmail(email);
        Trip trip = attachment.getTrip();
        if (!TripService.userIsAParticipant(user, trip)) {
            throw new UserNotParticipantException(user, UserNotParticipantExceptionCodes.CANT_DELETE); //FIXME: gestire permessi per eliminazione
        }
        trip.removeAttachment(attachment);
        tripRepository.save(trip);
        attachmentRepository.deleteById(id);
    }



}
