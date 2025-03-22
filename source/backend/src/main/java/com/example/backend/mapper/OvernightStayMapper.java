package com.example.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.backend.dto.OvernightStayDTO;
import com.example.backend.model.OvernightStay;

@Mapper(componentModel = "spring")
public interface OvernightStayMapper {
    

    // Da OvernightStay a OvernightStayDTO
    OvernightStayDTO toDTO(OvernightStay overnightStay);

    // Da EventOvernightStayDTODTO a OvernightStay
    @Mapping(target = "travelDays", ignore = true)
    OvernightStay toEntity(OvernightStayDTO OvernightStayDTO);
}



