package com.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;


@Data
public class NightDTO extends EventDTO {


    private OvernightStayDTO overnightStay = null;
}
