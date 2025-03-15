package com.example.backend.mapper;

import com.example.backend.dto.AttachmentDTO;
import com.example.backend.dto.AttachmentSimpleDTO;
import com.example.backend.model.Attachment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AttachmentMapper {


    @Mapping(target = "attachedToId", source = "attachedTo.id")
    AttachmentDTO toDTO(Attachment attachment);

    @Mapping(target = "tripId", source="trip.id")
    AttachmentSimpleDTO toSimpleDTO(Attachment attachment);



}
