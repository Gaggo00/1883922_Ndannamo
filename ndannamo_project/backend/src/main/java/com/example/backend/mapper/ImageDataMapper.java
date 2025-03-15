package com.example.backend.mapper;

import com.example.backend.dto.ImageDataDTO;
import com.example.backend.model.ImageData;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring", uses = UserMapperSimple.class)
public interface ImageDataMapper {

    @Mapping(target = "tripId", source="trip.id")
    ImageDataDTO toDTO(ImageData image);

    @Mapping(target = "trip", ignore = true)
    @Mapping(target = "uploadedBy", ignore = true)
    @Mapping(target = "imageData", ignore = true)
    ImageData toEntity(ImageDataDTO imageDataDTO);
}
