package com.example.backend.dto;

import lombok.Data;

@Data
public class UserDTOSimple {
    private long id;
    private String nickname;
    private String email;
}
