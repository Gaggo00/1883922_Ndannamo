package com.example.backend.mapper;

import com.example.backend.dto.AttachmentDTO;
import com.example.backend.dto.AttachmentSimpleDTO;
import com.example.backend.model.Attachment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AttachmentMapper {


    AttachmentDTO toDTO(Attachment attachment);

    AttachmentSimpleDTO toSimpleDTO(Attachment attachment);

}
