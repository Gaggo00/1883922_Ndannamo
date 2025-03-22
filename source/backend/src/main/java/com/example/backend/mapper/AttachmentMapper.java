package com.example.backend.mapper;

import com.example.backend.dto.AttachmentDTO;
import com.example.backend.model.Attachment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AttachmentMapper {



    AttachmentDTO toDTO(Attachment attachment);

}
